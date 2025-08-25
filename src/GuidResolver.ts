import { AbortController as AzureAbortController } from "@azure/abort-controller";
import { GuidResolverAzure                       } from "./GuidResolverAzure/GuidResolverAzure";
import { GuidResolverMicrosoftEntraId            } from "./GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraId";
import { GuidResolverResponse                    } from "./Models/GuidResolverResponse";
import { TokenCredential                         } from "@azure/identity";

export interface IGuidResolver {
    resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined>;
}
export interface IGuidResolverAzure {
    resolve(guid: string, abortController: AzureAbortController): Promise<GuidResolverResponse | undefined>;
}

export interface IGuidResolverInitsAzure {
    resolve(abortController: AzureAbortController): Promise<void>;
}

export interface IGuidResolverInitsMicrosoftEntraId {
    resolve(abortController: AbortController): Promise<void>;
}

export class GuidResolver implements IGuidResolver {
        private readonly guidResolverAzure           : GuidResolverAzure           ;
        private readonly guidResolverMicrosoftEntraId: GuidResolverMicrosoftEntraId;

    constructor(
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential,
        callbackError: (error: string) => void
    ) { 
        this.guidResolverAzure            = new GuidResolverAzure           (onResponse, onToBeResolved,                   tokenCredential, callbackError);
        this.guidResolverMicrosoftEntraId = new GuidResolverMicrosoftEntraId(onResponse, onToBeResolved, onProgressUpdate, tokenCredential, callbackError);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const abortController = new AbortController();
        const azureAbortController = new AzureAbortController();
        abortController.signal.addEventListener('abort', () => azureAbortController.abort());

        const promiseMicrosoftEntraId = this.guidResolverMicrosoftEntraId.resolve(guid, abortController     );
        const promiseAzure            = this.guidResolverAzure           .resolve(guid, azureAbortController);

        return await promiseMicrosoftEntraId
            ?? await promiseAzure;
    }

    async init(abortController: AbortController): Promise<void> {
        const azureAbortController = new AzureAbortController();
        abortController.signal.addEventListener('abort', () => azureAbortController.abort());

        await this.guidResolverAzure           .init(azureAbortController);
        await this.guidResolverMicrosoftEntraId.init(abortController);
    }
}
