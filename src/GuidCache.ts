import { GuidResolver         } from "./GuidResolver"               ;
import { GuidResolverResponse } from "./Models/GuidResolverResponse";
import { Memento              } from "vscode"                       ;

export class GuidCache {

    private readonly cache         : Map<string, Promise<GuidResolverResponse | undefined>>;
    private readonly guidTransform : (guid: string) => string;

    constructor(
        private readonly guidResolver: GuidResolver,
        private readonly memento: Memento,
        private readonly callbackInfo: (value: any) => void
    ) {
        this.cache = new Map<string, Promise<GuidResolverResponse | undefined>>();
        this.guidTransform = (guid: string) => guid.toLowerCase().trim();
    }

    dispose(): any {
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

    enqueuePromise(guid: string): void {
        const guidTransformed = this.guidTransform(guid);

        this.callbackInfo(`${guidTransformed} - enqueue`);

        if (!this.cache.has(guidTransformed)) {
            this.cache.set(
                guidTransformed, 
                this.guidResolver.resolve(guidTransformed)
                                 .then(
                                    (resolvedValue: GuidResolverResponse | undefined) => {
                                        if (resolvedValue) {
                                             this.update(guidTransformed, resolvedValue);
                                        }
                                         
                                         this.cache.delete(guidTransformed);

                                         return resolvedValue;
                                     }
                                 )
            );
        }
    }

    async enqueueBatchResolve(guids: string[]): Promise<string[] | undefined> {
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

            const promise = this.cache.get(guidTransformed);

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

            const promise = this.cache.get(guidTransformed);

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
            this.cache.clear();
        } catch (e: any) {
            this.callbackInfo(`clear - error ${e}`);
        }
    }
}
