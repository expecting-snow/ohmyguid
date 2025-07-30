import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdUserWithDetails extends GuidResolverMicrosoftEntraIdBase {
    constructor(
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response       = await this.getClient(abortController).api(`/users/${guid}`).get();
            const responseGroups = await this.getClient(abortController).api(`/users/${guid}`).expand('transitiveMemberOf').get();

            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID User Details',
                    {
                        user: response,
                        transitiveMemberOf: responseGroups?.transitiveMemberOf.map((p: any) => p.id)
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
