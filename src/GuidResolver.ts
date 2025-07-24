import { GuidResolverAzure            } from "./GuidResolverAzure/GuidResolverAzure";
import { GuidResolverMicrosoftEntraId } from "./GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraId";
import { GuidResolverResponse         } from "./Models/GuidResolverResponse";
import { TokenCredential              } from "@azure/identity";

export class GuidResolver {

    constructor(
        readonly tokenCredential: TokenCredential,
    ) { }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const abortController = new AbortController();

        const promiseMicrosoftEntraId = GuidResolverMicrosoftEntraId.resolve(guid, this.tokenCredential, abortController);
        const promiseAzure            = GuidResolverAzure           .resolve(guid, this.tokenCredential, abortController);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }
}
