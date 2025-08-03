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
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        tokenCredential : TokenCredential,
        callbackError   : (error: any) => void
    ) {
        this.guidResolvers = [
            new GuidResolverMicrosoftEntraIdTenant                  (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdAppRegistration         (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdServicePrincipal        (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdGroup                   (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdUser                    (onResponse, onToBeResolved, tokenCredential               ),
            new GuidResolverMicrosoftEntraIdDirectoryObject         (onResponse, onToBeResolved, tokenCredential, callbackError),
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
