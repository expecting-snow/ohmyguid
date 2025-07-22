
import { MicrosoftEntraIdTenantInformation } from "./Models/MicrosoftEntraIdTenantInformation";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidLinkProvider {

    static resolveLink(item: GuidResolverResponse): string | undefined {
        if (!item) {
            return undefined;
        }

        switch (item.type) {
            case "Azure Subscription":
                return `https://portal.azure.com/#@${(item.object as MicrosoftEntraIdTenantInformation).tenantId}/resource/subscriptions/${item.guid}`;
            default:
                console.log(`No link available for type: ${item.type}`);
                return undefined;
        }
    }
}
