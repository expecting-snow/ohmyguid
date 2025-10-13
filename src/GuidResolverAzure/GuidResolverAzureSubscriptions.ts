import { AbortController                  } from "@azure/abort-controller"       ;
import { IGuidBatchResolverAzure          } from "../GuidResolver"               ;
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { Mutex                            } from 'async-mutex'                   ;
import { Subscription, SubscriptionClient } from "@azure/arm-subscriptions"      ;
import { TokenCredential                  } from "@azure/identity"               ;

export class GuidResolverAzureSubscriptions implements IGuidBatchResolverAzure {
    private readonly client: SubscriptionClient;
    private readonly mutex  : Mutex            ;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.client = new SubscriptionClient(tokenCredential);
        this.mutex  = new Mutex()                            ;
    }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            for await (const subscription of this.client.subscriptions.list({ abortSignal: abortController.signal }) as AsyncIterableIterator<Subscription>) {
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

    async resolveBatch(guids: string[], abortController: AbortController): Promise<string[] | undefined> {
        return this.mutex.runExclusive(async () => {
            const resolvedGuids: string[] = [];

            try {
                for await (const subscription of this.client.subscriptions.list({ abortSignal: abortController.signal }) as AsyncIterableIterator<Subscription>) {
                    if (subscription.id && subscription.displayName) {

                        if(!subscription.subscriptionId) { continue; }

                        if (guids.indexOf(subscription.subscriptionId) !== -1) {
                            resolvedGuids.push(subscription.subscriptionId);
                        }

                        this.onResponse(
                            new GuidResolverResponse(
                                subscription.subscriptionId,
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

            return resolvedGuids;
        });
    }
}
