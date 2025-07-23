import { AuthProvider, Client                                               } from "@microsoft/microsoft-graph-client";
import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration";
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId";
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup";
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal";
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant";
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser";
import { GuidResolverResponse                                 } from "./Models/GuidResolverResponse";
import { TokenCredential                                      } from "@azure/identity";

export class GuidResolverMicrosoftEntraId {

    private readonly microsoftEntraIdAppRegistrationGuidResolver         : GuidResolverMicrosoftEntraIdAppRegistration;
    private readonly microsoftEntraIdServicePrincipalClientIdGuidResolver: GuidResolverMicrosoftEntraIdServicePrincipalClientId;
    private readonly microsoftEntraIdServicePrincipalGuidResolver        : GuidResolverMicrosoftEntraIdServicePrincipal;
    private readonly microsoftEntraIdAppRegistrationClientIdGuidResolver : GuidResolverMicrosoftEntraIdAppRegistrationClientId;
    private readonly microsoftEntraIdGroupGuidResolver                   : GuidResolverMicrosoftEntraIdGroup;
    private readonly microsoftEntraIdUserGuidResolver                    : GuidResolverMicrosoftEntraIdUser;
    private readonly microsoftEntraIdTenantGuidResolver                  : GuidResolverMicrosoftEntraIdTenant;
    
    constructor(
        readonly tokenCredential: TokenCredential
    ) {

        const microsoftGraphClient = Client.init({
            authProvider: async (done) => {
                const token = await this.tokenCredential.getToken("https://graph.microsoft.com/.default");

                if (!token) {
                    return done(new Error("Failed to acquire token"), null);
                }
                if (!token.token) {
                    return done(new Error("Failed to acquire token"), null);
                }

                done(null, token.token);

            }
        });

        this.microsoftEntraIdAppRegistrationGuidResolver          = new GuidResolverMicrosoftEntraIdAppRegistration         (microsoftGraphClient);
        this.microsoftEntraIdServicePrincipalGuidResolver         = new GuidResolverMicrosoftEntraIdServicePrincipal        (microsoftGraphClient);
        this.microsoftEntraIdAppRegistrationClientIdGuidResolver  = new GuidResolverMicrosoftEntraIdAppRegistrationClientId (microsoftGraphClient);
        this.microsoftEntraIdServicePrincipalClientIdGuidResolver = new GuidResolverMicrosoftEntraIdServicePrincipalClientId(microsoftGraphClient);
        this.microsoftEntraIdGroupGuidResolver                    = new GuidResolverMicrosoftEntraIdGroup                   (microsoftGraphClient);
        this.microsoftEntraIdUserGuidResolver                     = new GuidResolverMicrosoftEntraIdUser                    (microsoftGraphClient);
        this.microsoftEntraIdTenantGuidResolver                   = new GuidResolverMicrosoftEntraIdTenant                  (microsoftGraphClient);
    }

    public async resolve(guid: string): Promise<GuidResolverResponse | undefined> {

        const promiseAppRegistration          = this.microsoftEntraIdAppRegistrationGuidResolver         .resolve(guid);
        const promiseAppRegistrationClientId  = this.microsoftEntraIdAppRegistrationClientIdGuidResolver .resolve(guid);
        const promiseServicePrincipal         = this.microsoftEntraIdServicePrincipalGuidResolver        .resolve(guid);
        const promiseServicePrincipalClientId = this.microsoftEntraIdServicePrincipalClientIdGuidResolver.resolve(guid);
        const promiseGroup                    = this.microsoftEntraIdGroupGuidResolver                   .resolve(guid);
        const promiseUser                     = this.microsoftEntraIdUserGuidResolver                    .resolve(guid);
        const promiseTenant                   = this.microsoftEntraIdTenantGuidResolver                  .resolve(guid);

        return await promiseAppRegistration
            ?? await promiseAppRegistrationClientId
            ?? await promiseServicePrincipal
            ?? await promiseServicePrincipalClientId
            ?? await promiseGroup
            ?? await promiseUser
            ?? await promiseTenant;
    }
}
