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

    async get(guid: string): Promise<GuidResolverResponse | undefined> {

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

            this.callbackInfo(`${guid} - NEW - ${resolvedValue.displayName}`);

            return resolvedValue;
        }

        return undefined;
    }

    set(guid: string): void {
        if (!this.cache.has(guid)) {
            this.callbackInfo(`${guid} - set`);

            this.cache.set(guid, this.guidResolver.resolve(guid));
        }
    }

    clear() {
        try {
            this.cache.clear();
        } catch (e: any) {
            this.callbackInfo(`clear - error ${e}`);
        }
    }
}
