import { GuidResolverAzure            } from "./GuidResolverAzure/GuidResolverAzure";
import { GuidResolverMicrosoftEntraId } from "./GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraId";
import { GuidResolverResponse         } from "./Models/GuidResolverResponse";
import { TokenCredential              } from "@azure/identity";

export interface IGuidResolver {
    resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined>;
}

export class GuidResolver implements IGuidResolver {
        private readonly guidResolverAzure           : GuidResolverAzure           ;
        private readonly guidResolverMicrosoftEntraId: GuidResolverMicrosoftEntraId;

    constructor(
        private readonly tokenCredential: TokenCredential,
    ) { 
        this.guidResolverAzure            = new GuidResolverAzure           (tokenCredential);
        this.guidResolverMicrosoftEntraId = new GuidResolverMicrosoftEntraId(tokenCredential);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const abortController = new AbortController();

        const promiseMicrosoftEntraId = this.guidResolverMicrosoftEntraId.resolve(guid, abortController);
        const promiseAzure            = this.guidResolverAzure           .resolve(guid, abortController);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }
}
