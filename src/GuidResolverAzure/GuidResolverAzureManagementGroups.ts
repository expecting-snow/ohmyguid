import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ResourceGraphClient  } from "@azure/arm-resourcegraph";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureManagementGroups {
    private readonly client: ResourceGraphClient;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.client = new ResourceGraphClient(tokenCredential);
    }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            const query = `resourcecontainers | where type == 'microsoft.management/managementgroups'`;

            const result = await this.client.resources({ query, subscriptions: [] }); // abortController adden

            if (result && result.data && Array.isArray(result.data)) {
                for (const managementGroup of result.data) {
                    if (managementGroup.id && managementGroup.name) {
                        this.onResponse(
                            new GuidResolverResponse(
                                managementGroup.id,
                                managementGroup.name,
                                "Azure ManagementGroup",
                                managementGroup,
                                new Date()
                            )
                        );
                    }

                    if (abortController.signal.aborted) {
                        break;
                    }
                }
            }
        }
        catch (e: any) {
            this.callbackError(`GuidResolverAzureManagementGroups ${e.message}`);
        }
    }
}
