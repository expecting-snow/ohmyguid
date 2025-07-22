import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdAppRegistration {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.api(`/applications/${guid}`).get();
            if (response && response.displayName) {
                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID AppRegistration',
                    response,
                    new Date()
                );
            }
        } catch { }
        
        return undefined;
    }
}
