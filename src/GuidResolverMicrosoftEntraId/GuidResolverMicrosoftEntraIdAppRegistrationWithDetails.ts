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
            const owners   = await this.resolveAll(`/applications/${guid}/owners`, abortController);
            
            if (response && response.displayName) {


                this.processResponses(owners , this.onResponse);
                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID AppRegistration Details',
                    {
                        appRegistration: response,
                        owners         : (owners as any[])?.map(this.mapIdDisplayName)
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
