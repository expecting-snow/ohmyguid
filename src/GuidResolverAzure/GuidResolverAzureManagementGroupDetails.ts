import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { TokenCredential      } from "@azure/identity"               ;
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups"   ;

export class GuidResolverAzureManagementGroupDetails {

private readonly managementGroupsAPI: ManagementGroupsAPI;
    constructor(
        tokenCredential: TokenCredential
    ) {
        this.managementGroupsAPI = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const managementGroups = [];
            for await (const managementGroup of this.managementGroupsAPI.entities.list({ abortSignal: abortController.signal })) {
                managementGroups.push(managementGroup);
            }


            // if (result.count > 0 && result.data[0].name === guid && result.data[0].properties.displayName) {

            //     abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    guid,
                    'Azure ManagementGroup Details',
                    managementGroups,
                    new Date()
                );
            // }
        }
        catch { }

        return undefined;
    }
}
