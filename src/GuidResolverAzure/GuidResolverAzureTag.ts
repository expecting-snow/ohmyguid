import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ResourceGraphClient  } from "@azure/arm-resourcegraph"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureTag {
    private readonly client: ResourceGraphClient;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new ResourceGraphClient(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const resultResources          = await this.client.resources({ query: `resources          | where isnotnull(['tags']) | extend tagsString = tostring(['tags']) | where tagsString contains '${guid}' | project-away tagsString`, subscriptions: [] }, { abortSignal: abortController.signal });
            const resultResourceContainers = await this.client.resources({ query: `resourcecontainers | where isnotnull(['tags']) | extend tagsString = tostring(['tags']) | where tagsString contains '${guid}' | project-away tagsString`, subscriptions: [] }, { abortSignal: abortController.signal });

            const results = [...resultResources.data, ...resultResourceContainers.data];

            if (results.length > 0) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    guid,
                    'Azure Resources By Tag',
                    results,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
