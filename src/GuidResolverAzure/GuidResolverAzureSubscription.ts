import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { SubscriptionClient   } from "@azure/arm-subscriptions";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureSubscription {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            for await (const subscription of new SubscriptionClient(tokenCredential).subscriptions.list({ abortSignal: abortController.signal })) {
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
