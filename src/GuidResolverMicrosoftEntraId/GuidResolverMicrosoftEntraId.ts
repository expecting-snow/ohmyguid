import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration"         ;
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdDirectoryObject          } from "./GuidResolverMicrosoftEntraIdDirectoryObject"         ;
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup"                   ;
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal"        ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant"                  ;
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser"                    ;
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse"                        ;
import { IGuidResolver                                        } from "../GuidResolver"                                       ;
import { TokenCredential                                      } from "@azure/identity"                                       ;

export class GuidResolverMicrosoftEntraId {
    private readonly guidResolvers: IGuidResolver[];

    constructor(
        tokenCredential: TokenCredential,
        callbackError: (error: any) => void
    ) {
        this.guidResolvers = [
            new GuidResolverMicrosoftEntraIdDirectoryObject         (tokenCredential, callbackError),
            new GuidResolverMicrosoftEntraIdTenant                  (tokenCredential               ),
            new GuidResolverMicrosoftEntraIdAppRegistration         (tokenCredential               ),
            new GuidResolverMicrosoftEntraIdAppRegistrationClientId (tokenCredential               ),
            new GuidResolverMicrosoftEntraIdServicePrincipal        (tokenCredential               ),
            new GuidResolverMicrosoftEntraIdServicePrincipalClientId(tokenCredential               ),
            new GuidResolverMicrosoftEntraIdGroup                   (tokenCredential               ),
            new GuidResolverMicrosoftEntraIdUser                    (tokenCredential               ),
        ];
     }
   
    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        for (const guidResolver of this.guidResolvers) {
            const response = await guidResolver.resolve(guid, abortController);
            if (response) {
                return response;
            }
        }
        return undefined;
    }
}
