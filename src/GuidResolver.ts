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
        const promiseMicrosoftEntraId = this.guidResolverMicrosoftEntraId.resolve(guid);
        const promiseAzure            = this.guidResolverAzure           .resolve(guid);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }
}
