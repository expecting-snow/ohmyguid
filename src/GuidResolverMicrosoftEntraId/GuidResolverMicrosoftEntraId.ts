import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration"         ;
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup"                   ;
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal"        ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant"                  ;
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser"                    ;
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse"                        ;
import { TokenCredential                                      } from "@azure/identity"                                       ;

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
        return await this.guidResolverMicrosoftEntraIdAppRegistration         .resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdAppRegistrationClientId .resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdServicePrincipal        .resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdGroup                   .resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdUser                    .resolve(guid, abortController)
            ?? await this.guidResolverMicrosoftEntraIdTenant                  .resolve(guid, abortController);
    }
}
