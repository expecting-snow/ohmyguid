import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ResourceGraphClient  } from "@azure/arm-resourcegraph"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureSubscriptions {
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
            const query = `resourcecontainers | where type == 'microsoft.resources/subscriptions'`;

            const result = await this.client.resources({ query, subscriptions: [] }, { abortSignal: abortController.signal });

            if (result && result.data && Array.isArray(result.data)) {
                for (const subscription of result.data) {
                    if (subscription.id && subscription.name) {
                        this.onResponse(
                            new GuidResolverResponse(
                                subscription.id,
                                subscription.name,
                                "Azure Subscription",
                                subscription,
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
            this.callbackError(`GuidResolverAzureSubscriptions ${e.message}`);
        }
    }
}
