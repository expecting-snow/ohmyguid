import { AbortController          } from "@azure/abort-controller"       ;
import { GuidResolverResponse     } from "../Models/GuidResolverResponse";
import { ResourceGraphClient      } from "@azure/arm-resourcegraph"      ;
import { ResourceManagementClient } from "@azure/arm-resources"          ;
import { SubscriptionClient       } from "@azure/arm-subscriptions"      ;
import { TokenCredential          } from "@azure/identity"               ;


export class GuidResolverAzureSubscriptionDetails {
    private readonly subscriptionClient: SubscriptionClient;
     private readonly resourceGraphClient: ResourceGraphClient;
    constructor(
        private readonly tokenCredential: TokenCredential
    ) {
        this.subscriptionClient = new SubscriptionClient(tokenCredential);
        this.resourceGraphClient = new ResourceGraphClient(tokenCredential);
    }

    async resolve(subscriptionId: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const client = new ResourceManagementClient(this.tokenCredential, subscriptionId);

            const subscription = await this.subscriptionClient.subscriptions.get(subscriptionId, { abortSignal: abortController.signal });
 
            const subscriptionsResourceGraph = await this.resourceGraphClient.resources({
                query: `resourcecontainers | where type == 'microsoft.resources/subscriptions' and subscriptionId == '${subscriptionId}'`,
                subscriptions: []
            }, {
                abortSignal: abortController.signal
            });

            const subscriptionResourceGraph = subscriptionsResourceGraph?.data.at(0);

            const hierarchy = subscriptionResourceGraph 
                            ? subscriptionResourceGraph?.properties?.managementGroupAncestorsChain?.map((p: any) => p.displayName || '')?.reverse().join(' / ') + ` / ${subscription.displayName}` 
                            : '';
            const tenantId = subscriptionResourceGraph 
                            ? subscriptionResourceGraph?.tenantId 
                            : '';

            const resourceGroups = [];
            for await (const group of client.resourceGroups.list({ abortSignal: abortController.signal })) {
                resourceGroups.push(group);
            }

            if (subscription && subscription.displayName) {
                abortController.abort();

                return new GuidResolverResponse(
                    subscriptionId,
                    subscription.displayName,
                    "Azure Subscription Details",
                    {
                        ids: {
                            id: subscription.id,
                            tenantId,
                            hierarchy,
                        },
                        resourceGroups: resourceGroups.map(p => tenantId ? `https://portal.azure.com/#@${tenantId}/resource/${p.id}` : p.id).sort(),
                        resource: subscription,
                        graph: subscriptionsResourceGraph?.data.at(0)
                    },
                    new Date()
                );
            }
        }
        catch (e: any) {
            console.error("Error resolving Azure subscription details:", e);
        }

        return undefined;
    }
}
