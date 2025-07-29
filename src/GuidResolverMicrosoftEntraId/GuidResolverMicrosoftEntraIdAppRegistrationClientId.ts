import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdAppRegistrationClientId extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/applications`).filter(`appId eq '${guid}'`).get();

            if (response && response.value && response.value.length > 0) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.value[0].displayName,
                    "Microsoft Entra ID AppRegistration",
                    response.value[0],
                    new Date()
                );
            }
        } catch (error) { }

        return undefined;
    }
}
