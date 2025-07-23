import { GuidResolverResponse } from "./Models/GuidResolverResponse";
import { SubscriptionClient   } from "@azure/arm-subscriptions";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureSubscription {
    private readonly client: SubscriptionClient;

    constructor(
        readonly tokenCredential: TokenCredential,
    ) {
        this.client = new SubscriptionClient(this.tokenCredential);
    }

    async resolve(guid: string, abortController : AbortController, abortSignal : AbortSignal): Promise<GuidResolverResponse | undefined> {
        try {
            for await (const subscription of this.client.subscriptions.list({ abortSignal })) {
                if (subscription.subscriptionId === guid && subscription.displayName) {
                    
                    abortController.abort();

                    return new GuidResolverResponse(
                        guid,
                        subscription.displayName,
                        "Azure Subscription",
                        subscription,
                        new Date()
                    );
                }
            }
        }
        catch { }

        return undefined;
    }
}
