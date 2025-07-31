import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroupWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential,
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response           = await this.getClient(abortController).api(`/groups/${guid}`).get();
            const owners             = await this.resolveAll(`/groups/${guid}/owners`            , abortController);
            const members            = await this.resolveAll(`/groups/${guid}/members`           , abortController);
            const appRoleAssignments = await this.resolveAll(`/groups/${guid}/appRoleAssignments`, abortController);

            if (response && response.displayName) {
                this.processResponses([response]        , this.onResponse);
                this.processResponses(owners            , this.onResponse);
                this.processResponses(members           , this.onResponse);
                this.processResponses(appRoleAssignments, this.onResponse);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Group Details',
                    {
                        group             : response,
                        owners            : (owners  as any[])?.map(this.mapIdDisplayName),
                        members           : (members as any[])?.map(this.mapIdDisplayName),
                        appRoleAssignments: appRoleAssignments
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
