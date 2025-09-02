import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidBatchResolver               } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

/**
    https://learn.microsoft.com/en-us/graph/api/directoryobject-getbyids

    Requires Directory.Read.All permission.
 */
export class GuidResolverMicrosoftEntraIdDirectoryObjects extends GuidResolverMicrosoftEntraIdBase implements IGuidBatchResolver{
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolveBatch(guids: string[], abortController: AbortController): Promise<string[] | undefined> {
        if (guids.length === 0) {
            return [];
        }

        const guidsResolved: string[] = [];
        const guidsToBeResolved = Array.from(new Set(guids));

        try {
            const batchSize = 1000;
            for (let i = 0; i < guidsToBeResolved.length; i += batchSize) {
                const guidsbatch = guidsToBeResolved.slice(i, i + batchSize);
                const response = await this.getClient(abortController).api(`/directoryObjects/getByIds`).post({ ids: guidsbatch });

                if (response && response.value && Array.isArray(response.value)) {
                    for (const item of response.value) {
                        const responseMapped = this.processResponse(item, this.onResponse, this.onToBeResolved);
                        if (responseMapped) {
                            guidsResolved.push(responseMapped.guid);
                        }
                    }
                }
            }
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraIdDirectoryObjects', e);
        }

        return guidsResolved;
    }
}
