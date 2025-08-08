import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ResourceGraphClient  } from "@azure/arm-resourcegraph"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureManagementGroup {
    private readonly client: ResourceGraphClient;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new ResourceGraphClient(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const query = `resourcecontainers | where type == 'microsoft.management/managementgroups' and name == '${guid}'`;

            const result = await this.client.resources({ query, subscriptions: [] }, { abortSignal: abortController.signal });

            if (result.count > 0 && result.data[0].name === guid && result.data[0].properties.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    result.data[0].properties.displayName,
                    'Azure ManagementGroup',
                    result.data[0],
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
