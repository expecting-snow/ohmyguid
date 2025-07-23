import { TokenCredential } from "@azure/identity";
import { GuidResolverAzure } from "./GuidResolverAzure";
import { GuidResolverMicrosoftEntraId } from "./GuidResolverMicrosoftEntraId";
import { GuidResolverResponse         } from "./Models/GuidResolverResponse";
 
export class GuidResolver {

    readonly guidResolverMicrosoftEntraId: GuidResolverMicrosoftEntraId;
    readonly guidResolverAzure: GuidResolverAzure;

    constructor(
        readonly tokenCredential: TokenCredential,
    ) {
        this.guidResolverMicrosoftEntraId = new GuidResolverMicrosoftEntraId(tokenCredential);
        this.guidResolverAzure            = new GuidResolverAzure           (tokenCredential);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const abortController = new AbortController();
        const abortSignal     = abortController.signal;

        const promiseMicrosoftEntraId = this.guidResolverMicrosoftEntraId.resolve(guid, abortController);
        const promiseAzure            = this.guidResolverAzure           .resolve(guid, abortController);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }
}
