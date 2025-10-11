import { GuidResolverMicrosoftEntraIdAppRegistrationClientId  } from "./GuidResolverMicrosoftEntraIdAppRegistrationClientId" ;
import { GuidResolverMicrosoftEntraIdBase                     } from "./GuidResolverMicrosoftEntraIdBase"                    ;
import { GuidResolverMicrosoftEntraIdGet                      } from "./GuidResolverMicrosoftEntraIdGet"                     ;
import { GuidResolverMicrosoftEntraIdServicePrincipalClientId } from "./GuidResolverMicrosoftEntraIdServicePrincipalClientId";
import { GuidResolverResponse                                 } from "../Models/GuidResolverResponse"                        ;
import { IGuidResolver                                        } from "../GuidResolver"                                       ;
import { TokenCredential                                      } from "@azure/identity"                                       ;

export class GuidResolverMicrosoftEntraIdAppRegistrationWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    private readonly guidResolverMicrosoftEntraIdAppRegistration          : GuidResolverMicrosoftEntraIdGet                     ;
    private readonly guidResolverMicrosoftEntraIdAppRegistrationClientId  : GuidResolverMicrosoftEntraIdAppRegistrationClientId ;
    private readonly guidResolverMicrosoftEntraIdServicePrincipalClientId : GuidResolverMicrosoftEntraIdServicePrincipalClientId;

    constructor(
        private readonly onResponse      : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                : string              ) => void,
        private readonly onProgressUpdate: (value               : string              ) => void,
        tokenCredential: TokenCredential
    ) {
        super(tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistration          = new GuidResolverMicrosoftEntraIdGet                     (guid => `/applications/${guid}`, onResponse, onToBeResolved, tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistrationClientId  = new GuidResolverMicrosoftEntraIdAppRegistrationClientId (onResponse, onToBeResolved, tokenCredential);
        this.guidResolverMicrosoftEntraIdServicePrincipalClientId = new GuidResolverMicrosoftEntraIdServicePrincipalClientId(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const application                  = await this.guidResolverMicrosoftEntraIdAppRegistration        .resolve(guid, new AbortController())
                                              ?? await this.guidResolverMicrosoftEntraIdAppRegistrationClientId.resolve(guid, new AbortController());
            const owners                       = await this.resolveAll(`/applications/${guid}/owners`                      , this.onResponse, _ => _                                                              , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const federatedIdentityCredentials = await this.resolveAll(`/applications/${guid}/federatedIdentityCredentials`, this.onResponse, _ => this.mapToTypeApplicationFederatedIdentityCredentials(guid, _) , this.onToBeResolved, this.onProgressUpdate, new AbortController());

            if (application && application.displayName) {

                this.onResponse(application);

                const servicePrincipal = application.object.appId
                                       ? await this.guidResolverMicrosoftEntraIdServicePrincipalClientId.resolve(application.object.appId, new AbortController())
                                       : undefined;

                const appRoleAssignedTo = servicePrincipal?.object?.id
                                        ? await this.resolveAll(`/servicePrincipals/${servicePrincipal?.object?.id}/appRoleAssignedTo` , this.onResponse, this.mapToTypeApproleAssignedTo, this.onToBeResolved, this.onProgressUpdate, new AbortController())
                                        : undefined;

                if (servicePrincipal) {
                    this.onResponse(servicePrincipal);
                }

                return new GuidResolverResponse(
                    guid,
                    application.displayName,
                    'Microsoft Entra ID AppRegistration Details',
                    {
                        ids               : {
                                               'application.displayName'                 : application.displayName,
                                               'application.id'                          : application      .object?.id,
                                               'application.appId'                       : application      .object?.appId,
                                               'application.publisherDomain'             : application      .object?.publisherDomain,
                                               'servicePrincipal.id'                     : servicePrincipal?.object?.id,
                                               'servicePrincipal.appOwnerOrganizationId' : servicePrincipal?.object?.appOwnerOrganizationId,
                                            },
                        owners            : (owners as any[])?.map(this.mapIdDisplayName).sort(),
                        appRegistration   : application.object,
                        federatedIdentityCredentials,
                        servicePrincipal,
                        appRoleAssignedTo
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
