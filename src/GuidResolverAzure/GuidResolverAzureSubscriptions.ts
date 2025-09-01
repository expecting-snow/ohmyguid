import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { SubscriptionClient   } from "@azure/arm-subscriptions"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureSubscriptions {
    private readonly client: SubscriptionClient;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.client = new SubscriptionClient(tokenCredential);
    }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            for await (const subscription of this.client.subscriptions.list({ abortSignal: abortController.signal })) {
                if (subscription.id && subscription.displayName) {
                    this.onResponse(
                        new GuidResolverResponse(
                            subscription.id,
                            subscription.displayName,
                            'Azure Subscription',
                            subscription,
                            new Date()
                        )
                    );
                }
            }
        }
        catch (e: any) {
            this.callbackError(`GuidResolverAzureSubscriptions ${e.message}`);
        }
    }
}
