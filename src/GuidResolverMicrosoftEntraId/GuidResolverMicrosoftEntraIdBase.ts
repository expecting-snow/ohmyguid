import { Client, PageCollection, PageIterator, PageIteratorCallback } from "@microsoft/microsoft-graph-client";
import { TokenCredential                                            } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                      } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

export class GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly tokenCredential: TokenCredential
    ) { }

    protected getClient(abortController: AbortController): Client {
        return Client.initWithMiddleware({
            fetchOptions: {
                signal: abortController.signal
            },
            authProvider: new TokenCredentialAuthenticationProvider(
                this.tokenCredential, {
                getTokenOptions: {
                    abortSignal: abortController.signal
                },
                scopes: [
                    'https://graph.microsoft.com/.default'
                ]
            }
            )
        });
    }

    protected async resolveAll(url: string, abortController: AbortController): Promise<any[] | undefined> {
        try {
            var collection: any[] = [];

            const response: PageCollection = await this.getClient(abortController).api(url).get();

            const callback: PageIteratorCallback = (item: any) => { collection.push(item); return true; };

            const pageIterator = new PageIterator(this.getClient(abortController), response, callback);

            await pageIterator.iterate();

            return collection;
        } catch {
            return undefined;
        }
    }

    protected mapIdDisplayName(p: any): { displayName: string; id: string } {
        return { 
            displayName: p?.displayName,
            id         : p?.id
        };
    }
}
