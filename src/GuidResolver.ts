import { GuidResolverAzure            } from "./GuidResolverAzure/GuidResolverAzure";
import { GuidResolverMicrosoftEntraId } from "./GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraId";
import { GuidResolverResponse         } from "./Models/GuidResolverResponse";
import { TokenCredential              } from "@azure/identity";

export interface IGuidResolver {
    resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined>;
}
export interface IGuidResolverInits {
    resolve( abortController: AbortController): Promise<void>;
}
export class GuidResolver implements IGuidResolver {
        private readonly guidResolverAzure           : GuidResolverAzure           ;
        private readonly guidResolverMicrosoftEntraId: GuidResolverMicrosoftEntraId;

    constructor(
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        tokenCredential: TokenCredential,
        callbackError: (error: string) => void
    ) { 
        this.guidResolverAzure            = new GuidResolverAzure           (onResponse, onToBeResolved, tokenCredential, callbackError);
        this.guidResolverMicrosoftEntraId = new GuidResolverMicrosoftEntraId(onResponse, onToBeResolved, tokenCredential, callbackError);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const abortController = new AbortController();

        const promiseMicrosoftEntraId = this.guidResolverMicrosoftEntraId.resolve(guid, abortController);
        const promiseAzure            = this.guidResolverAzure           .resolve(guid, abortController);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }

    async init(abortController: AbortController): Promise<void> {
        await this.guidResolverAzure.init(abortController);
    }
}
