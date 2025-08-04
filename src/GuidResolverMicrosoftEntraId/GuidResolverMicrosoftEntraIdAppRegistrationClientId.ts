import { GuidResolverMicrosoftEntraIdAppRegistration } from "./GuidResolverMicrosoftEntraIdAppRegistration";
import { GuidResolverMicrosoftEntraIdBase            } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse                        } from "../Models/GuidResolverResponse";
import { IGuidResolver                               } from "../GuidResolver";
import { TokenCredential                             } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdAppRegistrationClientId extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    private readonly guidResolverMicrosoftEntraIdAppRegistration : GuidResolverMicrosoftEntraIdAppRegistration;

    constructor(
        onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential);
        this.guidResolverMicrosoftEntraIdAppRegistration = new GuidResolverMicrosoftEntraIdAppRegistration(onResponse, onToBeResolved, tokenCredential);
     }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/applications`).filter(`appId eq '${guid}'`).get();

            const id = response?.value?.at(0)?.id;

            if (id) {
                const response = await this.guidResolverMicrosoftEntraIdAppRegistration.resolve(id, abortController);

                return response;
            }
        } catch (error) { }

        return undefined;
    }
}
