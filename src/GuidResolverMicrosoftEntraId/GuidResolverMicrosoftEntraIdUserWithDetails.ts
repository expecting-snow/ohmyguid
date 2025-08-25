import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdUser } from "./GuidResolverMicrosoftEntraIdUser";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdUserWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {

    private readonly guidResolverMicrosoftEntraIdUser: GuidResolverMicrosoftEntraIdUser;
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential); 
        this.guidResolverMicrosoftEntraIdUser = new GuidResolverMicrosoftEntraIdUser(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.guidResolverMicrosoftEntraIdUser.resolve(guid, new AbortController());
            const memberOf           = await this.resolveAll(`/users/${guid}/memberOf`          , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const transitiveMemberOf = await this.resolveAll(`/users/${guid}/transitiveMemberOf`, this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const ownedObjects       = await this.resolveAll(`/users/${guid}/ownedObjects`      , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const appRoleAssignments = await this.resolveAll(`/users/${guid}/appRoleAssignments`, this.onResponse, this.mapToTypeApproleAssignment, this.onToBeResolved, this.onProgressUpdate, new AbortController());
            const createdObjects     = await this.resolveAll(`/users/${guid}/createdObjects`    , this.onResponse, _ => _                         , this.onToBeResolved, this.onProgressUpdate, new AbortController());

            if (response && response.displayName) {
                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID User Details',
                    {
                        ids               : {
                                                id                : response.object?.id,
                                                userPrincipalName : response.object?.userPrincipalName
                                            },
                        memberOf          : (memberOf           as any[])?.map(this.mapIdDisplayName    ).sort(),
                        transitiveMemberOf: (transitiveMemberOf as any[])?.map(this.mapIdDisplayName    ).sort(),
                        ownedObjects      : (ownedObjects       as any[])?.map(this.mapIdDisplayName    ).sort(),
                        appRoleAssignments: (appRoleAssignments as any[])?.map(this.mapAppRoleAssignment).sort(),
                        createdObjects    : (createdObjects     as any[])?.map(this.mapIdDisplayName    ).sort(),
                        user              : response.object
                    },
                    new Date()
                );
            }
        } catch { }
        return undefined;
    }
}
