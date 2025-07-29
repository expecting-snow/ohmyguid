import { Memento } from "vscode";
import { GuidResolver } from "./GuidResolver";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidCache {

    private cache: Map<string, Promise<GuidResolverResponse | undefined>> = new Map();

    constructor(
        private readonly guidResolver: GuidResolver,
        private readonly memento: Memento,
        private readonly callbackInfo: (value: any) => void
    ) { }

    dispose(): any {
        this.callbackInfo('cache - dispose');
        this.clear();
    }

    async getResolved(guid: string): Promise<GuidResolverResponse | undefined> {
        const response = this.memento.get<GuidResolverResponse>(guid);

        if (response) {
            this.callbackInfo(`${guid} - ${response.displayName}`);

            return response;
        }

        const promise = this.cache.get(guid);

        if(!promise){
            return undefined;
        }

        const resolvedValue = await promise;

        if (resolvedValue) {
            this.memento.update(guid, resolvedValue);

            this.trySetAzureSubscription(resolvedValue);

            this.callbackInfo(`${guid} - NEW - ${resolvedValue.displayName}`);

            return resolvedValue;
        }

        return undefined;
    }

    getResolvedOrEnqueue(guid: string): GuidResolverResponse | undefined {
        const response = this.memento.get<GuidResolverResponse>(guid);

        if (response) {
            return response;
        }

        if (!this.cache.has(guid)) {
            this.callbackInfo(`${guid} - set`);

            this.cache.set(guid, this.guidResolver.resolve(guid));
        }

        return undefined;
    }

    private trySetAzureSubscription(guidResolverResponse: GuidResolverResponse): void {
        if (guidResolverResponse.type === 'Azure Subscription') {
            this.memento.update(`Azure Subscription ${guidResolverResponse.guid}`, guidResolverResponse);
        }
    }

    private getAzureSubscriptions(): GuidResolverResponse[] {
        const keys = this.memento.keys();
        const keysAzureSubscriptions = keys.filter(key => key.startsWith('Azure Subscription '));
        const subscriptions: GuidResolverResponse[] = [];

        for (const key of keysAzureSubscriptions) {
            const response = this.memento.get<GuidResolverResponse>(key);
            if (response) {
                subscriptions.push(response);
            }
        }

        return subscriptions;
    }

    update(guid: string, guidResolverResponse: GuidResolverResponse): void {
        this.memento.update(guid, guidResolverResponse);
    }

    clear() {
        try {
            this.cache.clear();
        } catch (e: any) {
            this.callbackInfo(`clear - error ${e}`);
        }
    }
}
