import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdAdminsitrativeUnit extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/directory/administrativeUnits/${guid}`).get();

            if (response && response.displayName) {
                this.processResponses(response, this.onResponse, this.onToBeResolved);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID Administrative Unit',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
