import { GuidResolverMicrosoftEntraIdAdminstrativeUnits                        } from "./GuidResolverMicrosoftEntraIdAdminstrativeUnits"      ;
import { GuidResolverMicrosoftEntraIdAppRegistrationClientId                   } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdAppRegistrations                          } from "./GuidResolverMicrosoftEntraIdAppRegistrations"        ;
import { GuidResolverMicrosoftEntraIdDirectoryObjects                          } from "./GuidResolverMicrosoftEntraIdDirectoryObjects"        ;
import { GuidResolverMicrosoftEntraIdDirectoryRoles                            } from "./GuidResolverMicrosoftEntraIdDirectoryRoles"          ;
import { GuidResolverMicrosoftEntraIdGroups                                    } from "./GuidResolverMicrosoftEntraIdGroups"                  ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId                  } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverMicrosoftEntraIdServicePrincipals                         } from "./GuidResolverMicrosoftEntraIdServicePrincipals"       ;
import { GuidResolverMicrosoftEntraIdUsers                                     } from "./GuidResolverMicrosoftEntraIdUsers"                   ;
import { GuidResolverResponse                                                  } from "../Models/GuidResolverResponse"                        ;
import { IGuidBatchResolver, IGuidResolver, IGuidResolverInitsMicrosoftEntraId } from "../GuidResolver"                                       ;
import { TokenCredential                                                       } from "@azure/identity"                                       ;
import { GuidResolverMicrosoftEntraIdGet                                       } from "./GuidResolverMicrosoftEntraIdGet"                     ;

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
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/directoryObjects/${guid}`                                               , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/tenantRelationships/findTenantInformationByTenantId(tenantId='${guid}')`, onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/applications/${guid}`                                                   , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/servicePrincipals/${guid}`                                              , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/groups/${guid}`                                                         , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/users/${guid}`                                                          , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/directory/administrativeUnits/${guid}`                                  , onResponse, onToBeResolved, tokenCredential),
            new GuidResolverMicrosoftEntraIdGet                     (guid => `/directoryRoles/${guid}`                                                 , onResponse, onToBeResolved, tokenCredential),

            // https://learn.microsoft.com/en-us/graph/api/cloudpc-get | permissions: CloudPC.Read.All
            // new GuidResolverMicrosoftEntraIdGet                     (guid => `/deviceManagement/virtualEndpoint/cloudPCs/${guid}`                      , onResponse, onToBeResolved, tokenCredential),
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
