import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/servicePrincipals/${guid}`).get();
            const appRoleAssignments = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignments`, this.onResponse, abortController);
            const appRoleAssignedTo  = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignedTo` , this.onResponse, abortController);
            const ownedObjects       = await this.resolveAll(`/servicePrincipals/${guid}/ownedObjects`      , this.onResponse, abortController);
            const owners             = await this.resolveAll(`/servicePrincipals/${guid}/owners`            , this.onResponse, abortController);

            if (response && response.displayName) {
                this.processResponses(response, this.onResponse);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        servicePrincipal   : response,
                        owners             : (owners            as any[])?.map(this.mapIdDisplayName     ).sort(),
                        appRoleAssignments : (appRoleAssignments as any[])?.map(this.mapAppRoleAssignment).sort(),
                        ownedObjects       : (ownedObjects      as any[])?.map(this.mapIdDisplayName     ).sort(),
                        appRoleAssignedTo  : appRoleAssignedTo
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
