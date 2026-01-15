import { AbortController      } from "@azure/abort-controller"           ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse"    ;
import { SubscriptionClient   } from "@azure/arm-resources-subscriptions";
import { TokenCredential      } from "@azure/identity"                   ;

export class GuidResolverAzureSubscription {
    private readonly client: SubscriptionClient;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new SubscriptionClient(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.subscriptions.get(guid, { abortSignal: abortController.signal });

            if (response.subscriptionId && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    response.subscriptionId,
                    response.displayName,
                    'Azure Subscription',
                    response,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
