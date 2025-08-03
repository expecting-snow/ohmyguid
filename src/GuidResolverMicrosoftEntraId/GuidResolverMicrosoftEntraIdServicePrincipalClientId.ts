import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalClientId extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/servicePrincipals`).filter(`appId eq '${guid}'`).get();

            if (response && response.value && response.value.length > 0) {
                this.processResponses(response.value[0], this.onResponse, this.onToBeResolved);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.value[0].displayName,
                    "Microsoft Entra ID ServicePrincipal",
                    response.value[0],
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
