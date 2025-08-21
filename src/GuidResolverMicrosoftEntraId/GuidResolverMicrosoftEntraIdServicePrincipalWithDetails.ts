import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId";
import { GuidResolverMicrosoftEntraIdBase                     } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdServicePrincipal         } from "./GuidResolverMicrosoftEntraIdServicePrincipal";
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse";
import { IGuidResolver                                        } from "../GuidResolver";
import { TokenCredential                                      } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    
    private readonly guidResolverMicrosoftEntraIdServicePrincipalClientId : GuidResolverMicrosoftEntraIdServicePrincipalClientId;
    private readonly guidResolverMicrosoftEntraIdServicePrincipal         : GuidResolverMicrosoftEntraIdServicePrincipal;
    private readonly guidResolverMicrosoftEntraIdAppRegistrationClientId  : GuidResolverMicrosoftEntraIdAppRegistrationClientId;
    
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential); 
        this.guidResolverMicrosoftEntraIdServicePrincipal         = new GuidResolverMicrosoftEntraIdServicePrincipal        (onResponse, onToBeResolved, tokenCredential);
        this.guidResolverMicrosoftEntraIdServicePrincipalClientId = new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistrationClientId  = new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const servicePrincipal   = await this.guidResolverMicrosoftEntraIdServicePrincipal        .resolve(guid, new AbortController())
                                    ?? await this.guidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(guid, new AbortController());
            const appRoleAssignments = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment, this.onToBeResolved, this.onProgressUpdate, abortController);
            const appRoleAssignedTo  = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignedTo` , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, abortController);
            const ownedObjects       = await this.resolveAll(`/servicePrincipals/${guid}/ownedObjects`      , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, abortController);
            const owners             = await this.resolveAll(`/servicePrincipals/${guid}/owners`            , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, abortController);

            if (servicePrincipal && servicePrincipal.displayName) {

                const appRegistration = servicePrincipal.object?.appId
                                      ? await this.guidResolverMicrosoftEntraIdAppRegistrationClientId.resolve(servicePrincipal.object.appId, new AbortController())
                                      : undefined;

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    servicePrincipal.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        ids               : {
                                               'application.id'                          : appRegistration?.object?.id,
                                               'application.publisherDomain'             : appRegistration?.object?.publisherDomain,
                                               'application.appId'                       : servicePrincipal.object?.appId,
                                               'servicePrincipal.id'                     : servicePrincipal.object?.id,
                                               'servicePrincipal.appOwnerOrganizationId' : servicePrincipal.object?.appOwnerOrganizationId,
                                            },
                        owners             : (owners             as any[])?.map(this.mapIdDisplayName    ).sort(),
                        servicePrincipal   : servicePrincipal.object,
                        appRoleAssignments : (appRoleAssignments as any[])?.map(this.mapAppRoleAssignment).sort(),
                        ownedObjects       : (ownedObjects       as any[])?.map(this.mapIdDisplayName    ).sort(),
                        appRoleAssignedTo  : appRoleAssignedTo
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
