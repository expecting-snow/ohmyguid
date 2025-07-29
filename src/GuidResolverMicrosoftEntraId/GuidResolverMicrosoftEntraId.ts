import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration";
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId";
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup";
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal";
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant";
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser";
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse";
import { TokenCredential                                      } from "@azure/identity";

export class GuidResolverMicrosoftEntraId {
    private readonly guidResolverMicrosoftEntraIdAppRegistration         : GuidResolverMicrosoftEntraIdAppRegistration         ;
    private readonly guidResolverMicrosoftEntraIdAppRegistrationClientId : GuidResolverMicrosoftEntraIdAppRegistrationClientId ;
    private readonly guidResolverMicrosoftEntraIdServicePrincipal        : GuidResolverMicrosoftEntraIdServicePrincipal        ;
    private readonly guidResolverMicrosoftEntraIdServicePrincipalClientId: GuidResolverMicrosoftEntraIdServicePrincipalClientId;
    private readonly guidResolverMicrosoftEntraIdGroup                   : GuidResolverMicrosoftEntraIdGroup                   ;
    private readonly guidResolverMicrosoftEntraIdUser                    : GuidResolverMicrosoftEntraIdUser                    ;
    private readonly guidResolverMicrosoftEntraIdTenant                  : GuidResolverMicrosoftEntraIdTenant                  ;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.guidResolverMicrosoftEntraIdAppRegistration          = new GuidResolverMicrosoftEntraIdAppRegistration         (tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistrationClientId  = new GuidResolverMicrosoftEntraIdAppRegistrationClientId (tokenCredential);
        this.guidResolverMicrosoftEntraIdServicePrincipal         = new GuidResolverMicrosoftEntraIdServicePrincipal        (tokenCredential);
        this.guidResolverMicrosoftEntraIdServicePrincipalClientId = new GuidResolverMicrosoftEntraIdServicePrincipalClientId(tokenCredential);
        this.guidResolverMicrosoftEntraIdGroup                    = new GuidResolverMicrosoftEntraIdGroup                   (tokenCredential);
        this.guidResolverMicrosoftEntraIdUser                     = new GuidResolverMicrosoftEntraIdUser                    (tokenCredential);
        this.guidResolverMicrosoftEntraIdTenant                   = new GuidResolverMicrosoftEntraIdTenant                  (tokenCredential);
     }
   
    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseAppRegistration          = this.guidResolverMicrosoftEntraIdAppRegistration         .resolve(guid, abortController);
        const promiseAppRegistrationClientId  = this.guidResolverMicrosoftEntraIdAppRegistrationClientId .resolve(guid, abortController);
        const promiseServicePrincipal         = this.guidResolverMicrosoftEntraIdServicePrincipal        .resolve(guid, abortController);
        const promiseServicePrincipalClientId = this.guidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(guid, abortController);
        const promiseGroup                    = this.guidResolverMicrosoftEntraIdGroup                   .resolve(guid, abortController);
        const promiseUser                     = this.guidResolverMicrosoftEntraIdUser                    .resolve(guid, abortController);
        const promiseTenant                   = this.guidResolverMicrosoftEntraIdTenant                  .resolve(guid, abortController);

        return await promiseTenant
            ?? await promiseAppRegistration
            ?? await promiseAppRegistrationClientId
            ?? await promiseServicePrincipal
            ?? await promiseServicePrincipalClientId
            ?? await promiseGroup
            ?? await promiseUser;
    }
}
