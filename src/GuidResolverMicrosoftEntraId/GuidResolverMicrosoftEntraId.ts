import { GuidResolverMicrosoftEntraIdAppRegistration          } from "./GuidResolverMicrosoftEntraIdAppRegistration"         ;
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdAppRegistrations         } from "./GuidResolverMicrosoftEntraIdAppRegistrations"        ;
import { GuidResolverMicrosoftEntraIdDirectoryObject          } from "./GuidResolverMicrosoftEntraIdDirectoryObject"         ;
import { GuidResolverMicrosoftEntraIdGroup                    } from "./GuidResolverMicrosoftEntraIdGroup"                   ;
import { GuidResolverMicrosoftEntraIdGroups                   } from "./GuidResolverMicrosoftEntraIdGroups"                  ;
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal"        ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdServicePrincipals        } from "./GuidResolverMicrosoftEntraIdServicePrincipals"       ;
import { GuidResolverMicrosoftEntraIdTenant                   } from "./GuidResolverMicrosoftEntraIdTenant"                  ;
import { GuidResolverMicrosoftEntraIdUser                     } from "./GuidResolverMicrosoftEntraIdUser"                    ;
import { GuidResolverMicrosoftEntraIdUsers                    } from "./GuidResolverMicrosoftEntraIdUsers"                   ;
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse"                        ;
import { IGuidResolver, IGuidResolverInitsMicrosoftEntraId    } from "../GuidResolver"                                       ;
import { TokenCredential                                      } from "@azure/identity"                                       ;

export class GuidResolverMicrosoftEntraId {
    private readonly guidResolvers        : IGuidResolver         [];
    private readonly microsoftEntraIdInits: IGuidResolverInitsMicrosoftEntraId[];

    constructor(
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        onProgressUpdate: (value                : string              ) => void,
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

        this.microsoftEntraIdInits = [
            new GuidResolverMicrosoftEntraIdUsers            (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdGroups           (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdAppRegistrations (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdServicePrincipals(onResponse, _ => {}, onProgressUpdate, tokenCredential),
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

    async init(abortController: AbortController): Promise<void> {
        try {
            for (const microsoftEntraIdInit of this.microsoftEntraIdInits) {
                await microsoftEntraIdInit.resolve(abortController);
            }
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraId', e);
        }
    }
}
