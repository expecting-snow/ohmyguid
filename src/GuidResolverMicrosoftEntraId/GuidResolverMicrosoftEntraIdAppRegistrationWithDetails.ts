import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdAppRegistrationWithDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly onResponse     : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/applications/${guid}`    ).get();
            const owners   = await this.resolveAll(`/applications/${guid}/owners`, this.onResponse, _ => _ , this.onToBeResolved, abortController);
            
            if (response && response.displayName) {

                const servicePrincipal = response.appId
                                       ? await this.getClient(abortController).api(`/servicePrincipals`).filter(`appId eq '${response.appId}'`).get()
                                       : undefined;

                this.processResponses(response , this.onResponse, this.onToBeResolved);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID AppRegistration Details',
                    {
                        appRegistration : response,
                        servicePrincipal: servicePrincipal?.value?.at(0)?.id,
                        owners          : (owners as any[])?.map(this.mapIdDisplayName).sort()
                    },
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
