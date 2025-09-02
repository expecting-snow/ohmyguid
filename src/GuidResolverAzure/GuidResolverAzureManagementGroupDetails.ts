import { AbortController                 } from "@azure/abort-controller"       ;
import { EntityInfo, ManagementGroupsAPI } from "@azure/arm-managementgroups"   ;
import { GuidResolverResponse            } from "../Models/GuidResolverResponse";
import { TokenCredential                 } from "@azure/identity"               ;

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
            for await (const managementGroup of this.managementGroupsAPI.entities.list({ abortSignal: abortController.signal }) as AsyncIterableIterator<EntityInfo>) {
                managementGroups.push(managementGroup);
            }

            return new GuidResolverResponse(
                guid,
                guid,
                'Azure ManagementGroup Details',
                managementGroups,
                new Date()
            );
        }
        catch { }

        return undefined;
    }
}
