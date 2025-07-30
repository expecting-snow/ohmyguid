import { GuidResolverMicrosoftEntraIdBase  } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse              } from "../Models/GuidResolverResponse";
import { TokenCredential                   } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroupWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        tokenCredential: TokenCredential,
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response                   = await this.getClient(abortController).api(`/groups/${guid}`                   )                  .get();
            const responseOwners             = await this.getClient(abortController).api(`/groups/${guid}`                   ).expand('owners' ).get();
            const responseMembers            = await this.getClient(abortController).api(`/groups/${guid}`                   ).expand('members').get();
            const responseAppRoleAssignments = await this.getClient(abortController).api(`/groups/${guid}/appRoleAssignments`)                  .get();
            
            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Group Details',
                    {
                        group             : response,
                        owners            : responseOwners ?.owners .map((p: any) => p.id),
                        members           : responseMembers?.members.map((p: any) => p.id),
                        appRoleAssignments: responseAppRoleAssignments.value
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
