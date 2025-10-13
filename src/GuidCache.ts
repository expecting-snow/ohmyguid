import { AbortController as AzureAbortController } from "@azure/abort-controller"                             ;
import { GuidResolver                            } from "./GuidResolver"                                      ;
import { GuidResolverAzureManagementGroup        } from "./GuidResolverAzure/GuidResolverAzureManagementGroup";
import { GuidResolverAzureSubscription           } from "./GuidResolverAzure/GuidResolverAzureSubscription"   ;
import { GuidResolverResponse                    } from "./Models/GuidResolverResponse"                       ;
import { Memento                                 } from "vscode"                                              ;

export class GuidCache {

    private readonly promisesWip   : Map<string, Promise<GuidResolverResponse | undefined>>;
    private readonly guidTransform : (guid: string) => string;

    constructor(
        private readonly guidResolver                     : GuidResolver,
        private readonly guidResolverAzureSubscription    : GuidResolverAzureSubscription,
        private readonly guidResolverAzureManagementGroup : GuidResolverAzureManagementGroup,
        private readonly memento                          : Memento,
        private readonly callbackInfo                     : (value: any) => void
    ) {
        this.promisesWip = new Map<string, Promise<GuidResolverResponse | undefined>>();
        this.guidTransform = (guid: string) => guid.toLowerCase().trim();
    }

    dispose(): void {
        this.callbackInfo('Cache - dispose');
        this.clear();
    }

    getResolved(guid: string): GuidResolverResponse | undefined {
        const guidTransformed = this.guidTransform(guid);

        if (guidTransformed === GuidResolverResponse.EMPTY_GUID) {
            return GuidResolverResponse.EMPTY_RESPONSE;
        }

        const response = this.memento.get<GuidResolverResponse>(guidTransformed);

        if (response) {
            this.callbackInfo(`${guidTransformed} - getResolved - in cache`);
        }
        else {
            this.callbackInfo(`${guidTransformed} - getResolved - not in cache`);
        }

        return response;
    }

    enqueuePromise(guid: string, type?: 'Azure ManagementGroup' | 'Azure Subscription'): void {
        const guidTransformed = this.guidTransform(guid);

        if (this.promisesWip.has(guidTransformed)) { return; }

        if (type === 'Azure ManagementGroup') {
            this.callbackInfo(`${guidTransformed} - enqueue AzureManagementGroup`);
            this.promisesWip.set(
                guidTransformed,
                this.guidResolverAzureManagementGroup.resolve(guidTransformed, new AzureAbortController())
                    .then(
                        (resolvedValue: GuidResolverResponse | undefined) => {
                            if (resolvedValue) {
                                this.update(guidTransformed, resolvedValue);
                            }

                            this.promisesWip.delete(guidTransformed);

                            return resolvedValue;
                        }
                    )
            );
        }
        else if (type === 'Azure Subscription') {
            this.callbackInfo(`${guidTransformed} - enqueue AzureSubscription`);
            this.promisesWip.set(
                guidTransformed,
                this.guidResolverAzureSubscription.resolve(guidTransformed, new AzureAbortController())
                    .then(
                        (resolvedValue: GuidResolverResponse | undefined) => {
                            if (resolvedValue) {
                                this.update(guidTransformed, resolvedValue);
                            }

                            this.promisesWip.delete(guidTransformed);

                            return resolvedValue;
                        }
                    )
            );
        }
        else {
            this.callbackInfo(`${guidTransformed} - enqueue`);
            this.promisesWip.set(
                guidTransformed,
                this.guidResolver.resolve(guidTransformed)
                    .then(
                        (resolvedValue: GuidResolverResponse | undefined) => {
                            if (resolvedValue) {
                                this.update(guidTransformed, resolvedValue);
                            }

                            this.promisesWip.delete(guidTransformed);

                            return resolvedValue;
                        }
                    )
            );
        }
    }

    async enqueueBatchResolve(guids: string[], type?: 'Azure ManagementGroup' | 'Azure Subscription'): Promise<string[] | undefined> {
        if (type === 'Azure ManagementGroup') {
            for (const guid of guids) {
                this.enqueuePromise(guid, 'Azure ManagementGroup');
            }

            return guids;
        }

        if (type === 'Azure Subscription') {
            for (const guid of guids) {
                this.enqueuePromise(guid, 'Azure Subscription');
            }

            return guids;
        }

        const resolvedGuids = await this.guidResolver.resolveBatch(guids, new AbortController());

        if (resolvedGuids) {
            for (const guid of guids) {
                if (resolvedGuids.indexOf(guid) === -1) {
                    this.enqueuePromise(guid);
                }
            }
        }

        return resolvedGuids;
    }

    getResolvedOrEnqueuePromise(guid: string): GuidResolverResponse | undefined {
        const response = this.getResolved(guid);

        if (response) {
            return response;
        }

        this.enqueuePromise(guid);

        return undefined;
    }

    async getResolvedOrResolvePromise(guid: string): Promise<GuidResolverResponse | undefined> {
        // 1. try to resolve response from cache
        {
            const response = this.getResolved(guid);

            if (response) {
                return response;
            }
        }

        // 2. try to resolve response from enqueued promise
        {
            const guidTransformed = this.guidTransform(guid);

            const promise = this.promisesWip.get(guidTransformed);

            if (promise) {
                const response = await promise;

                if (response) {
                    return response;
                }
            }
        }

        // 3. try to resolve response or enqueue promise
        {
            const response = this.getResolvedOrEnqueuePromise(guid);

            if (response) {
                return response;
            }
        }

        // 4. try to resolve response from enqueued promise
        {
            const guidTransformed = this.guidTransform(guid);

            const promise = this.promisesWip.get(guidTransformed);

            if (promise) {
                const response = await promise;

                if (response) {
                    return response;
                }
            }
        }

        return undefined;
    }

    update(guid: string, guidResolverResponse: GuidResolverResponse): void {
        const guidTransformed = this.guidTransform(guid);

        if (guidTransformed === GuidResolverResponse.EMPTY_GUID) {
            return;
        }

        this.callbackInfo(`${guidTransformed} - update      - ${guidResolverResponse.type} - ${guidResolverResponse.displayName}`);
        this.memento.update(guidTransformed, guidResolverResponse);
    }

    clear() {
        try {
            this.promisesWip.clear();
        } catch (e: any) {
            this.callbackInfo(`clear - error ${e}`);
        }
    }
}
