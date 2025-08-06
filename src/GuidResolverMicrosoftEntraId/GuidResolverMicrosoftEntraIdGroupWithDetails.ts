import { GuidResolverMicrosoftEntraIdBase  } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdGroup } from "./GuidResolverMicrosoftEntraIdGroup";
import { GuidResolverResponse              } from "../Models/GuidResolverResponse";
import { IGuidResolver                     } from "../GuidResolver";
import { TokenCredential                   } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroupWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver{

    private readonly guidResolverMicrosoftEntraIdGroup: GuidResolverMicrosoftEntraIdGroup;
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential,
    ) { 
        super(tokenCredential); 
        this.guidResolverMicrosoftEntraIdGroup = new GuidResolverMicrosoftEntraIdGroup(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            // https://developer.microsoft.com/en-us/graph/known-issues/?search=25984
            //
            // GET /groups/{id}/members doesn't return service principals in v1.0
            // The List group members API operation on the v1.0 endpoint currently doesn't return any service principals that might be members of the queried group. 
            // Workaround
            // As a workaround, use one of the following options:
            // Use the List group members API operation on the beta endpoint.
            // Use the /groups/{id}?$expand=members API operation.
            // const members         = await this.resolveAll(`/groups/${guid}/members`           , this.onResponse, _ => _                          , this.onToBeResolved, abortController);

            const response           = await this.guidResolverMicrosoftEntraIdGroup.resolve(guid, new AbortController());
            const owners             = await this.resolveAll(`/groups/${guid}/owners`            , this.onResponse, _ => _                          , this.onToBeResolved, abortController        );
            const members            = await this.resolveAll(`/groups/${guid}/members`           , this.onResponse, _ => _                          , this.onToBeResolved, abortController, 'beta');
            const appRoleAssignments = await this.resolveAll(`/groups/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment , this.onToBeResolved, abortController        );
            const memberOf           = await this.resolveAll(`/groups/${guid}/memberOf`          , this.onResponse, _ => _                          , this.onToBeResolved, abortController        );
            const transitiveMemberOf = await this.resolveAll(`/groups/${guid}/transitiveMemberOf`, this.onResponse, _ => _                          , this.onToBeResolved, abortController        );
            const transitiveMembers  = await this.resolveAll(`/groups/${guid}/transitiveMembers` , this.onResponse, _ => _                          , this.onToBeResolved, abortController, 'beta');

            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Group Details',
                    {
                        ids               : {
                                                id   : response.object?.id,
                                                name : response.displayName
                                            },
                        owners            : (owners             as any[])?.map(this.mapIdDisplayName).sort(),
                        members           : (members            as any[])?.map(this.mapIdDisplayName).sort(),
                        transitiveMembers : (transitiveMembers  as any[])?.map(this.mapIdDisplayName).sort(),
                        memberOf          : (memberOf           as any[])?.map(this.mapIdDisplayName).sort(),
                        transitiveMemberOf: (transitiveMemberOf as any[])?.map(this.mapIdDisplayName).sort(),
                        group             : response.object,
                        appRoleAssignments: appRoleAssignments,
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
