import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdUserWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/users/${guid}`).get();
            const transitiveMemberOf = await this.resolveAll(`/users/${guid}/transitiveMemberOf`, this.onResponse, _ => _                         , this.onToBeResolved, abortController);
            const ownedObjects       = await this.resolveAll(`/users/${guid}/ownedObjects`      , this.onResponse, _ => _                         , this.onToBeResolved, abortController);
            const appRoleAssignments = await this.resolveAll(`/users/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment, this.onToBeResolved, abortController);
            const createdObjects     = await this.resolveAll(`/users/${guid}/createdObjects`    , this.onResponse, _ => _                         , this.onToBeResolved, abortController);

            if (response && response.displayName) {
                this.processResponses(response, this.onResponse, this.onToBeResolved);
                
                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID User Details',
                    {
                        user              : response,
                        transitiveMemberOf: (transitiveMemberOf as any[])?.map(this.mapIdDisplayName    ).sort(),
                        ownedObjects      : (ownedObjects       as any[])?.map(this.mapIdDisplayName    ).sort(),
                        appRoleAssignments: (appRoleAssignments as any[])?.map(this.mapAppRoleAssignment).sort(),
                        createdObjects    : (createdObjects     as any[])?.map(this.mapIdDisplayName    ).sort()
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
