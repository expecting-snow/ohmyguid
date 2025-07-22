import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdGroup {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.api(`/groups/${guid}`).get();
            if (response && response.displayName) {
                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Group',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
