import { Client                                               } from "@microsoft/microsoft-graph-client";
import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration";
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId";
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup";
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal";
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant";
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser";
import { GuidResolverResponse                                 } from "./Models/GuidResolverResponse";
import { TokenCredential                                      } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

export class GuidResolverMicrosoftEntraId {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController: AbortController): Promise<GuidResolverResponse | undefined> {

        const client = Client.initWithMiddleware({
            fetchOptions: {
                signal: abortController.signal
            },
            authProvider: new TokenCredentialAuthenticationProvider(
                tokenCredential, {
                    getTokenOptions: {
                        abortSignal: abortController.signal
                    },
                    scopes: [
                        'https://graph.microsoft.com/.default'
                    ]
                }
            )
        });

        const promiseAppRegistration          = GuidResolverMicrosoftEntraIdAppRegistration         .resolve(client, guid, abortController);
        const promiseAppRegistrationClientId  = GuidResolverMicrosoftEntraIdAppRegistrationClientId .resolve(client, guid, abortController);
        const promiseServicePrincipal         = GuidResolverMicrosoftEntraIdServicePrincipal        .resolve(client, guid, abortController);
        const promiseServicePrincipalClientId = GuidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(client, guid, abortController);
        const promiseGroup                    = GuidResolverMicrosoftEntraIdGroup                   .resolve(client, guid, abortController);
        const promiseUser                     = GuidResolverMicrosoftEntraIdUser                    .resolve(client, guid, abortController);
        const promiseTenant                   = GuidResolverMicrosoftEntraIdTenant                  .resolve(client, guid, abortController);

        return await promiseAppRegistration
            ?? await promiseAppRegistrationClientId
            ?? await promiseServicePrincipal
            ?? await promiseServicePrincipalClientId
            ?? await promiseGroup
            ?? await promiseUser
            ?? await promiseTenant;
    }
}
