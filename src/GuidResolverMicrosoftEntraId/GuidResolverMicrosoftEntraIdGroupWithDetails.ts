import { GuidResolverMicrosoftEntraIdBase  } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdGroup } from "./GuidResolverMicrosoftEntraIdGroup";
import { GuidResolverResponse              } from "../Models/GuidResolverResponse";
import { IGuidResolver                     } from "../GuidResolver";
import { TokenCredential                   } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroupWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver{

    private readonly guidResolverMicrosoftEntraIdGroup: GuidResolverMicrosoftEntraIdGroup;
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential,
    ) { 
        super(tokenCredential); 
        this.guidResolverMicrosoftEntraIdGroup = new GuidResolverMicrosoftEntraIdGroup(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.guidResolverMicrosoftEntraIdGroup.resolve(guid, new AbortController());
            const owners             = await this.resolveAll(`/groups/${guid}/owners`            , this.onResponse, _ => _                          , this.onToBeResolved, this.onProgressUpdate, abortController        );
            const members            = await this.resolveAll(`/groups/${guid}/members`           , this.onResponse, _ => _                          , this.onToBeResolved, this.onProgressUpdate, abortController, 'beta');
            const appRoleAssignments = await this.resolveAll(`/groups/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment , this.onToBeResolved, this.onProgressUpdate, abortController        );
            const memberOf           = await this.resolveAll(`/groups/${guid}/memberOf`          , this.onResponse, _ => _                          , this.onToBeResolved, this.onProgressUpdate, abortController        );
            const transitiveMemberOf = await this.resolveAll(`/groups/${guid}/transitiveMemberOf`, this.onResponse, _ => _                          , this.onToBeResolved, this.onProgressUpdate, abortController        );
            const transitiveMembers  = await this.resolveAll(`/groups/${guid}/transitiveMembers` , this.onResponse, _ => _                          , this.onToBeResolved, this.onProgressUpdate, abortController, 'beta');

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
