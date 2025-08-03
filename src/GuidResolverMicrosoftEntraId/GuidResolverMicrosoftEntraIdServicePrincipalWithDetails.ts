import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/servicePrincipals/${guid}`).get();
            const appRoleAssignments = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment, this.onToBeResolved, abortController);
            const appRoleAssignedTo  = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignedTo` , this.onResponse, _ => _                         , this.onToBeResolved, abortController);
            const ownedObjects       = await this.resolveAll(`/servicePrincipals/${guid}/ownedObjects`      , this.onResponse, _ => _                         , this.onToBeResolved, abortController);
            const owners             = await this.resolveAll(`/servicePrincipals/${guid}/owners`            , this.onResponse, _ => _                         , this.onToBeResolved, abortController);

            if (response && response.displayName) {

                const appRegistration = response.appId
                                      ? await this.getClient(abortController).api(`/applications`).filter(`appId eq '${response.appId}'`).get()
                                      : undefined;

                this.processResponses(response       , this.onResponse, this.onToBeResolved);
                this.processResponses(appRegistration, this.onResponse, this.onToBeResolved);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        servicePrincipal   : response,
                        appRegistration    : appRegistration?.value?.at(0)?.id,
                        owners             : (owners             as any[])?.map(this.mapIdDisplayName    ).sort(),
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
