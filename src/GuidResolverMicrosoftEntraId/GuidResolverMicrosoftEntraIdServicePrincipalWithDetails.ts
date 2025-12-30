import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId";
import { GuidResolverMicrosoftEntraIdBase                     } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdGet                      } from "./GuidResolverMicrosoftEntraIdGet";
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse";
import { IGuidResolver                                        } from "../GuidResolver";
import { TokenCredential                                      } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {

    private readonly guidResolverMicrosoftEntraIdServicePrincipalClientId : GuidResolverMicrosoftEntraIdServicePrincipalClientId;
    private readonly guidResolverMicrosoftEntraIdServicePrincipal         : GuidResolverMicrosoftEntraIdGet;
    private readonly guidResolverMicrosoftEntraIdAppRegistrationClientId  : GuidResolverMicrosoftEntraIdAppRegistrationClientId;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) {
        super(tokenCredential);
        this.guidResolverMicrosoftEntraIdServicePrincipal         = new GuidResolverMicrosoftEntraIdGet(guid => `/servicePrincipals/${guid}`, onResponse, onToBeResolved, tokenCredential),
        this.guidResolverMicrosoftEntraIdServicePrincipalClientId = new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistrationClientId  = new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const servicePrincipal       = await this.guidResolverMicrosoftEntraIdServicePrincipal        .resolve(guid, new AbortController())
                                        ?? await this.guidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(guid, new AbortController());
            const appRoleAssignments     = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment, this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const appRoleAssignedTo      = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignedTo` , this.onResponse, this.mapToTypeApproleAssignedTo, this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const ownedObjects           = await this.resolveAll(`/servicePrincipals/${guid}/ownedObjects`      , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const servicePrinicpalOwners = await this.resolveAll(`/servicePrincipals/${guid}/owners`            , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const memberOf               = await this.resolveAll(`/servicePrincipals/${guid}/memberOf`          , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const transitiveMemberOf     = await this.resolveAll(`/servicePrincipals/${guid}/transitiveMemberOf`, this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());

            if (servicePrincipal && servicePrincipal.displayName) {

                this.processResponse(servicePrincipal, this.onResponse, this.onToBeResolved);

                const appRegistration = servicePrincipal.object?.appId
                                      ? await this.guidResolverMicrosoftEntraIdAppRegistrationClientId.resolve(servicePrincipal.object.appId, new AbortController())
                                      : undefined;

                const appRegistrationOwners        = appRegistration?.object?.id ? await this.resolveAll(`/applications/${appRegistration.object.id}/owners`                      , this.onResponse, _ => _                                                              , this.onToBeResolved, this.onProgressUpdate, new AbortController()) : null;
                const federatedIdentityCredentials = appRegistration?.object?.id ? await this.resolveAll(`/applications/${appRegistration.object.id}/federatedIdentityCredentials`, this.onResponse, _ => this.mapToTypeApplicationFederatedIdentityCredentials(guid, _) , this.onToBeResolved, this.onProgressUpdate, new AbortController()) : null;

                if (appRegistration) {
                    this.onResponse(appRegistration);
                }

                return new GuidResolverResponse(
                    guid,
                    servicePrincipal.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        ids               : {
                                               'servicePrincipal.appDisplayName'         : servicePrincipal.displayName,
                                               'application.id'                          : appRegistration?.object?.id,
                                               'application.publisherDomain'             : appRegistration?.object?.publisherDomain,
                                               'application.appId'                       : servicePrincipal.object?.appId,
                                               'servicePrincipal.id'                     : servicePrincipal.object?.id,
                                               'servicePrincipal.appOwnerOrganizationId' : servicePrincipal.object?.appOwnerOrganizationId,
                                            },
                        appRegistrationOwners  : (appRegistrationOwners  as any[])?.map(this.mapIdDisplayName    ).sort(),
                        servicePrincipalOwners : (servicePrinicpalOwners as any[])?.map(this.mapIdDisplayName    ).sort(),
                        servicePrincipal       : servicePrincipal.object                                                 ,
                        appRoleAssignments     : (appRoleAssignments     as any[])?.map(this.mapAppRoleAssignment).sort(),
                        ownedObjects           : (ownedObjects           as any[])?.map(this.mapIdDisplayName    ).sort(),
                        appRoleAssignedTo      : appRoleAssignedTo,
                        appRegistration,
                        federatedIdentityCredentials,
                        memberOf               : (memberOf               as any[])?.map(this.mapIdDisplayName    ).sort(),
                        transitiveMemberOf     : (transitiveMemberOf     as any[])?.map(this.mapIdDisplayName    ).sort(),
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
