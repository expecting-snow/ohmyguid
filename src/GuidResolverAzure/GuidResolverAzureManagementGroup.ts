import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureManagementGroup {
    private readonly managementGroupsAPI: ManagementGroupsAPI;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.managementGroupsAPI = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.managementGroupsAPI.managementGroups.get(guid, { abortSignal: abortController.signal });

            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Azure ManagementGroup',
                    response,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
