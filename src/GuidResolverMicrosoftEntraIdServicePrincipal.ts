import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdServicePrincipal {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.api(`/servicePrincipals/${guid}`).get();
            if (response && response.displayName) {
                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID ServicePrincipal',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
