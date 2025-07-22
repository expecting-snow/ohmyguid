import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdAppRegistrationClientId {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.api(`/applications`).filter(`appId eq '${guid}'`).get();
            if (response && response.value && response.value.length > 0) {
                return new GuidResolverResponse(
                    guid,
                    response.value[0].displayName,
                    "Microsoft Entra ID AppRegistration",
                    response.value[0],
                    new Date()
                );
            }
        } catch (error) { }

        return undefined;
    }
}
