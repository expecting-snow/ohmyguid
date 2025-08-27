import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidBatchResolver               } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdDirectoryObjects extends GuidResolverMicrosoftEntraIdBase implements IGuidBatchResolver{
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolveBatch(guids: string[], abortController: AbortController): Promise<string[] | undefined> {
        const guidsResolved: string[] = [];

        if (guids.length > 0) {

            try {
                // https://learn.microsoft.com/en-us/graph/api/directoryobject-getbyids

                // todo add batching if more than x guids

                const response = await this.getClient(abortController).api(`/directoryObjects/getByIds`).post({ ids: guids });

                if (response && response.value && Array.isArray(response.value)) {
                    for (const item of response.value) {
                        const responseMapped = this.processResponse(item, this.onResponse, this.onToBeResolved);
                        if (responseMapped) {
                            guidsResolved.push(responseMapped.guid);
                        }
                    }
                }
            } catch (e: any) {
                console.error('GuidResolverMicrosoftEntraIdDirectoryObjects', e);
            }
        }

        return guidsResolved;
    }
}
