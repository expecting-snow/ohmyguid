import { Memento } from "vscode";
import { GuidResolver } from "./GuidResolver";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

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

        return this.memento.get<GuidResolverResponse>(guidTransformed);
    }

    getResolvedOrEnqueuePromise(guid: string): GuidResolverResponse | undefined {
        const response = this.getResolved(guid);

        if (response) {
            return response;
        }

        const guidTransformed = this.guidTransform(guid);

        if (!this.cache.has(guidTransformed)) {
            this.callbackInfo(`${guidTransformed} - set`);

            this.cache.set(
                guidTransformed, 
                this.guidResolver.resolve(guidTransformed)
                                 .then(
                                    (resolvedValue: GuidResolverResponse | undefined) => {
                                        if (resolvedValue) {
                                             this.update(guidTransformed, resolvedValue);
                                         } else {
                                             this.callbackInfo(`${guidTransformed} - NOT FOUND`);
                                         }
                                         
                                         this.cache.delete(guidTransformed);

                                         return resolvedValue;
                                     }
                                 )
            );
        }

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

        this.callbackInfo(`${guidTransformed} - ${guidResolverResponse.type} - ${guidResolverResponse.displayName}`);
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
