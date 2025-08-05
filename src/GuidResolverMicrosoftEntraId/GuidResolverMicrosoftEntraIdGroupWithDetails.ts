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
            const response           = await this.guidResolverMicrosoftEntraIdGroup.resolve(guid, new AbortController());
            const owners             = await this.resolveAll(`/groups/${guid}/owners`            , this.onResponse, _ => _                          , this.onToBeResolved, abortController);
            const members            = await this.resolveAll(`/groups/${guid}/members`           , this.onResponse, _ => _                          , this.onToBeResolved, abortController);
            const appRoleAssignments = await this.resolveAll(`/groups/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment , this.onToBeResolved, abortController);
            const transitiveMemberOf = await this.resolveAll(`/groups/${guid}/transitiveMemberOf`, this.onResponse, _ => _                          , this.onToBeResolved, abortController);

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
                        group             : response.object,
                        appRoleAssignments: appRoleAssignments,
                        transitiveMemberOf: (transitiveMemberOf as any[])?.map(this.mapIdDisplayName).sort(),
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
