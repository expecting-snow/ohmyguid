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
            const appRoleAssignments = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignments`, abortController);
            const appRoleAssignedTo  = await this.resolveAll(`/servicePrincipals/${guid}/appRoleAssignedTo` , abortController);
            const ownedObjects       = await this.resolveAll(`/servicePrincipals/${guid}/ownedObjects`      , abortController);
            const owners             = await this.resolveAll(`/servicePrincipals/${guid}/owners`            , abortController);

            if (response && response.displayName) {
                this.processResponses(owners            , this.onResponse);
                this.processResponses(appRoleAssignedTo , this.onResponse);
                this.processResponses(ownedObjects      , this.onResponse);
                this.processResponses(appRoleAssignments, this.onResponse);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        servicePrincipal   : response,
                        owners             : (owners            as any[])?.map(this.mapIdDisplayName),
                        appRoleAssignments : appRoleAssignments,
                        appRoleAssignedTo  : appRoleAssignedTo,
                        ownedObjects       : (ownedObjects      as any[])?.map(this.mapIdDisplayName)
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
