import { Mutex                                                             } from 'async-mutex';
import { TokenCredential, AccessToken, AzureCliCredential, GetTokenOptions } from '@azure/identity';

/**
 * A wrapper around {@link AzureCliCredential} that adds in-memory caching for access tokens per unique combination
 * of scopes and tenantId. If a valid (non-expired) token is found in the cache, it is returned immediately.
 *
 * The {@link AzureCliCredential} performs a child_process.exec for each getToken call which does not scale.
 * https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/src/credentials/azureCliCredential.ts#L78
 * 
 */
export class CachingAzureCliCredential implements TokenCredential {
    private readonly credential: AzureCliCredential      ;
    private readonly cache     : Map<string, AccessToken>;
    private readonly mutex     : Mutex                   ;

    // this is used to prevent multiple calls to getToken when getToken fails due to authentication issues.
    // If an error occurs, it will wait 5 seconds before allowing another attempt to authenticate
    private tryToAuthenticate: boolean = true;

    constructor(
        readonly callbackInfo: (value: any) => void,
        readonly callbackError: (error: any) => void
    ) {
        this.credential = new AzureCliCredential      ();
        this.cache      = new Map<string, AccessToken>();
        this.mutex      = new Mutex                   ();
    }

    getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken> {
        return this.mutex.runExclusive(async () => {

            const key = ((Array.isArray(scopes) ? scopes.join(' ') : scopes) + ` ${options?.tenantId ?? ''}`).trim();

            if (this.cache.has(key)) {
                const accessToken = this.cache.get(key);
                if (accessToken && accessToken.expiresOnTimestamp > Date.now()) {
                    return accessToken;
                }
            }

            if (!this.tryToAuthenticate) {
                return Promise.reject(new Error('Not trying to authenticate, waiting for next try.'));
            }

            this.callbackInfo(`CachingAzureCliCredential getToken - ${key}`);
            try{

                const accessToken = await this.credential.getToken(scopes, options);
                
                this.cache.set(key, accessToken);
                
                return accessToken;
            }
            catch (e: any) {
                this.tryToAuthenticate = false;

                setTimeout(() => {
                    this.tryToAuthenticate = true;
                }, 5000);

                this.callbackError('Authentication error: please run "az login" in your terminal.');
                throw e;
            }
        });
    }
}
