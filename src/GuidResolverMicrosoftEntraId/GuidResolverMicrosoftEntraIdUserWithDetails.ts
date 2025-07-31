import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdUserWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/users/${guid}`).get();
            const transitiveMemberOf = await this.resolveAll(`/users/${guid}/transitiveMemberOf`, abortController);
            const ownedObjects       = await this.resolveAll(`/users/${guid}/ownedObjects`      , abortController);
            const appRoleAssignments = await this.resolveAll(`/users/${guid}/appRoleAssignments`, abortController);
            const createdObjects     = await this.resolveAll(`/users/${guid}/createdObjects`    , abortController);

            if (response && response.displayName) {
                this.processResponses(transitiveMemberOf, this.onResponse);
                this.processResponses(createdObjects    , this.onResponse);
                this.processResponses(ownedObjects      , this.onResponse);
                this.processResponses(appRoleAssignments, this.onResponse);
                
                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID User Details',
                    {
                        user              : response,
                        transitiveMemberOf: (transitiveMemberOf as any[])?.map(this.mapIdDisplayName),
                        ownedObjects      : (ownedObjects       as any[])?.map(this.mapIdDisplayName),
                        appRoleAssignments: appRoleAssignments,
                        createdObjects    : (createdObjects     as any[])?.map(this.mapIdDisplayName)
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
