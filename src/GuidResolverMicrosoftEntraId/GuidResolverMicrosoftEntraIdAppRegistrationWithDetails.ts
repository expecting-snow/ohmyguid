import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdAppRegistrationWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/applications/${guid}`).get();
            const owners   = await this.resolveAll(`/applications/${guid}/owners`, this.onResponse, abortController);
            
            if (response && response.displayName) {

                this.processResponses(response , this.onResponse);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID AppRegistration Details',
                    {
                        appRegistration: response,
                        owners         : (owners as any[])?.map(this.mapIdDisplayName).sort()
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
