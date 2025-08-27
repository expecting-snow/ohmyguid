import { GuidResolverMicrosoftEntraIdAdministrativeUnit                        } from "./GuidResolverMicrosoftEntraIdAdministrativeUnit"      ;
import { GuidResolverMicrosoftEntraIdAdminstrativeUnits                        } from "./GuidResolverMicrosoftEntraIdAdminstrativeUnits"      ;
import { GuidResolverMicrosoftEntraIdAppRegistration                           } from "./GuidResolverMicrosoftEntraIdAppRegistration"         ;
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId                   } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdAppRegistrations                          } from "./GuidResolverMicrosoftEntraIdAppRegistrations"        ;
import { GuidResolverMicrosoftEntraIdDirectoryObject                           } from "./GuidResolverMicrosoftEntraIdDirectoryObject"         ;
import { GuidResolverMicrosoftEntraIdDirectoryObjects                          } from "./GuidResolverMicrosoftEntraIdDirectoryObjects"        ;
import { GuidResolverMicrosoftEntraIdDirectoryRole                             } from "./GuidResolverMicrosoftEntraIdDirectoryRole"           ;
import { GuidResolverMicrosoftEntraIdDirectoryRoles                            } from "./GuidResolverMicrosoftEntraIdDirectoryRoles"          ;
import { GuidResolverMicrosoftEntraIdGroup                                     } from "./GuidResolverMicrosoftEntraIdGroup"                   ;
import { GuidResolverMicrosoftEntraIdGroups                                    } from "./GuidResolverMicrosoftEntraIdGroups"                  ;
import { GuidResolverMicrosoftEntraIdServicePrincipal                          } from "./GuidResolverMicrosoftEntraIdServicePrincipal"        ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId                  } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdServicePrincipals                         } from "./GuidResolverMicrosoftEntraIdServicePrincipals"       ;
import { GuidResolverMicrosoftEntraIdTenant                                    } from "./GuidResolverMicrosoftEntraIdTenant"                  ;
import { GuidResolverMicrosoftEntraIdUser                                      } from "./GuidResolverMicrosoftEntraIdUser"                    ;
import { GuidResolverMicrosoftEntraIdUsers                                     } from "./GuidResolverMicrosoftEntraIdUsers"                   ;
import { GuidResolverResponse                                                  } from "../Models/GuidResolverResponse"                        ;
import { IGuidBatchResolver, IGuidResolver, IGuidResolverInitsMicrosoftEntraId } from "../GuidResolver"                                       ;
import { TokenCredential                                                       } from "@azure/identity"                                       ;

export class GuidResolverMicrosoftEntraId implements IGuidBatchResolver{
    private readonly guidResolvers        : IGuidResolver                     [];
    private readonly guidBatchResolvers   : IGuidBatchResolver                [];
    private readonly microsoftEntraIdInits: IGuidResolverInitsMicrosoftEntraId[];

    constructor(
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        onProgressUpdate: (value                : string              ) => void,
        tokenCredential : TokenCredential,
        callbackError   : (error: any) => void
    ) {
        this.guidResolvers = [
            new GuidResolverMicrosoftEntraIdDirectoryObject         (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdTenant                  (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdAppRegistration         (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdServicePrincipal        (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGroup                   (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdUser                    (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdAdministrativeUnit      (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdDirectoryRole           (onResponse, onToBeResolved, tokenCredential),
        ];

        this.microsoftEntraIdInits = [
            new GuidResolverMicrosoftEntraIdAdminstrativeUnits(onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdUsers             (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdGroups            (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdAppRegistrations  (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdServicePrincipals (onResponse, _ => {}, onProgressUpdate, tokenCredential),
            new GuidResolverMicrosoftEntraIdDirectoryRoles    (onResponse, _ => {}, onProgressUpdate, tokenCredential),
        ];

        this.guidBatchResolvers = [
            new GuidResolverMicrosoftEntraIdDirectoryObjects(onResponse, onToBeResolved, tokenCredential)
        ];
     }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        for (const guidResolver of this.guidResolvers) {
            try {
                const response = await guidResolver.resolve(guid, abortController);
                if (response) {
                    return response;
                }
            }
            catch { }
        }
        return undefined;
    }

    async resolveBatch(guids: string[], abortController: AbortController): Promise<string[] | undefined> {
        const resolvedGuids = new Set<string>();

        try {
            for (const guidBatchResolver of this.guidBatchResolvers) {
                const collection = await guidBatchResolver.resolveBatch(guids, abortController);

                if (collection) {
                    for (const item of collection) {
                        resolvedGuids.add(item);
                    }
                }
            }
        } catch (e: any) {
            console.error(e);
        }

        return Array.from(resolvedGuids.keys());
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
