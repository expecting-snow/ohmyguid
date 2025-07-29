import { Client                                } from "@microsoft/microsoft-graph-client";
import { TokenCredential                       } from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

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
}
