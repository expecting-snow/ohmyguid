import { GuidResolverMicrosoftEntraIdBase             } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverMicrosoftEntraIdServicePrincipal } from "./GuidResolverMicrosoftEntraIdServicePrincipal";
import { GuidResolverResponse                         } from "../Models/GuidResolverResponse";
import { IGuidResolver                                } from "../GuidResolver";
import { TokenCredential                              } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipalClientId extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    
    private readonly guidResolverMicrosoftEntraIdServicePrincipal : GuidResolverMicrosoftEntraIdServicePrincipal;

    constructor(
        onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential); 
        this.guidResolverMicrosoftEntraIdServicePrincipal = new GuidResolverMicrosoftEntraIdServicePrincipal(onResponse, onToBeResolved, tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/servicePrincipals`).filter(`appId eq '${guid}'`).get();

            const id = response?.value?.at(0)?.id;

            if (id) {
                const response = await this.guidResolverMicrosoftEntraIdServicePrincipal.resolve(id, abortController);

                return response;
            }
        } catch { }

        return undefined;
    }
}
