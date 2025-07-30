import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response                      = await this.getClient(abortController).api(`/servicePrincipals/${guid}`                      ).get();
            const responseAppRoleAssignments    = await this.getClient(abortController).api(`/servicePrincipals/${guid}/appRoleAssignments`   ).get();
            const responseAssignedTo            = await this.getClient(abortController).api(`/servicePrincipals/${guid}/appRoleAssignedTo`    ).get();
            const responseOwnedObjects          = await this.getClient(abortController).api(`/servicePrincipals/${guid}/ownedObjects`         ).get();
 
            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID ServicePrincipal Details',
                    {
                        servicePrincipal     : response,
                        appRoleAssignments   : responseAppRoleAssignments.value,
                        appRoleAssignedTo    : responseAssignedTo.value,
                        ownedObjects         : responseOwnedObjects.value
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
