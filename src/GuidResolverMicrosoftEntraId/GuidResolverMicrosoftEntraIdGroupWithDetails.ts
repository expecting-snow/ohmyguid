import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroupWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver{
    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential,
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/groups/${guid}`).get();
            const owners             = await this.resolveAll(`/groups/${guid}/owners`            , this.onResponse, abortController);
            const members            = await this.resolveAll(`/groups/${guid}/members`           , this.onResponse, abortController);
            const appRoleAssignments = await this.resolveAll(`/groups/${guid}/appRoleAssignments`, this.onResponse, abortController);

            if (response && response.displayName) {
                this.processResponses(response, this.onResponse);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Group Details',
                    {
                        group             : response,
                        owners            : (owners  as any[])?.map(this.mapIdDisplayName).sort(),
                        members           : (members as any[])?.map(this.mapIdDisplayName).sort(),
                        appRoleAssignments: appRoleAssignments
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
