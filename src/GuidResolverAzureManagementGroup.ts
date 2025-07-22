import { GuidResolverResponse } from "./Models/GuidResolverResponse";
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureManagementGroup {

    private readonly client: ManagementGroupsAPI;

    constructor(
        readonly tokenCredential: TokenCredential
    ) {
        this.client = new ManagementGroupsAPI(this.tokenCredential);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        try {
            const managementGroup = await this.client.managementGroups.get(guid);

            if (managementGroup && managementGroup.displayName) {
                return new GuidResolverResponse(
                    guid,
                    managementGroup.displayName,
                    'Azure ManagementGroup',
                    managementGroup,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
