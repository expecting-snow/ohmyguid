import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdTenant {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.api(`/tenantRelationships/findTenantInformationByTenantId(tenantId='${guid}')`).get();
            if (response && response.displayName) {
                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Tenant',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
