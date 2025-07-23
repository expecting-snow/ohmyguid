import { GuidResolver } from "./GuidResolver";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidCache {

    private cache: Map<string, Promise<GuidResolverResponse | undefined>> = new Map();
    private cacheResolved: Map<string, GuidResolverResponse | undefined> = new Map();

    constructor(
        readonly guidResolver: GuidResolver
    ) { }

    dispose(): any {
        console.log('ohmyguid - cache - dispose');
        this.clear();
    }

    async get(guid: string): Promise<GuidResolverResponse | undefined> {
        if (this.cacheResolved.has(guid)) {

            const response = this.cacheResolved.get(guid);

            if (response) {
                console.log(`ohmyguid ${guid} - ${response.displayName}`);

                return response;
            }
        }

        const resolvedValue = await this.cache.get(guid);

        if (resolvedValue) {
            this.cacheResolved.set(guid, resolvedValue);

            console.log(`ohmyguid ${guid} - NEW - ${resolvedValue.displayName}`);

            return resolvedValue;
        }

        return undefined;
    }

    set(guid: string): void {
        if (!this.cache.has(guid)) {
            console.log(`ohmyguid ${guid} - set`);

            this.cache.set(guid, this.guidResolver.resolve(guid));
        }
    }

    clear() {
        try {
            this.cache.clear();
            this.cacheResolved.clear();
        } catch (e: any) {
            console.log(`ohmyguid - clear - error ${e}`);
        }
    }
}
