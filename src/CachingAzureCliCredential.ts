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

    constructor() {
        this.credential = new AzureCliCredential      ();
        this.cache      = new Map<string, AccessToken>();
        this.mutex      = new Mutex                   ();
    }

    async getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken> {
        return await this.mutex.runExclusive(async () => {

            const key = (Array.isArray(scopes) ? scopes.join(' ') : scopes) + ` | ${options?.tenantId ?? ''}`;

            if (this.cache.has(key)) {
                const accessToken = this.cache.get(key);
                if (accessToken && accessToken.expiresOnTimestamp > Date.now()) {
                    return accessToken;
                }
            }

            console.log(`CachingAzureCliCredential getToken - cache miss - ${key}`);
            const accessToken = await this.credential.getToken(scopes, options);

            this.cache.set(key, accessToken);

            return accessToken;
        });
    }
}
