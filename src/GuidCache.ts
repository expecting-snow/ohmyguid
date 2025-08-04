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

    async getResolved(guid: string): Promise<GuidResolverResponse | undefined> {
        const guidTransformed = this.guidTransform(guid);

        if (guidTransformed === GuidResolverResponse.EMPTY_GUID) {
            return GuidResolverResponse.EMPTY_RESPONSE;
        }

        const response = this.memento.get<GuidResolverResponse>(guidTransformed);

        if (response) {
            this.callbackInfo(`${guidTransformed} - ${response.displayName}`);

            return response;
        }

        const promise = this.cache.get(guidTransformed);

        if (promise) {
            const resolvedValue = await promise;

            if (resolvedValue) {
                this.memento.update(guidTransformed, resolvedValue);

                this.callbackInfo(`${guidTransformed} - NEW - ${resolvedValue.displayName}`);

                return resolvedValue;
            }
        }

        return undefined;
    }

    getResolvedOrEnqueue(guid: string): GuidResolverResponse | undefined {
        const guidTransformed = this.guidTransform(guid);

        if (guidTransformed === GuidResolverResponse.EMPTY_GUID) {
            return GuidResolverResponse.EMPTY_RESPONSE;
        }

        const response = this.memento.get<GuidResolverResponse>(guidTransformed);

        if (response) {
            return response;
        }

        if (!this.cache.has(guidTransformed)) {
            this.callbackInfo(`${guidTransformed} - set`);

            this.cache.set(guidTransformed, this.guidResolver.resolve(guidTransformed));
        }

        return undefined;
    }

    update(guid: string, guidResolverResponse: GuidResolverResponse): void {
        const guidTransformed = this.guidTransform(guid);

        if (guidTransformed === GuidResolverResponse.EMPTY_GUID) {
            return;
        }

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
