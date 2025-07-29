import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { PolicyClient         } from "@azure/arm-policy";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzurePolicyDefinition {

    constructor(
        private readonly tokenCredential: TokenCredential
    ) { }
    
    async resolve(guid: string, subscriptionIds: string[], abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        for (const subscriptionId of subscriptionIds) {
            const response = await this.resolveInternal(guid, subscriptionId, this.tokenCredential, abortController);
            if (response) {
                abortController.abort();

                return response;
            }
        }

        return undefined;
    }

    private async resolveInternal(guid: string, subscriptionId: string, tokenCredential: TokenCredential, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        console.log('resolveInternal');
        try {
            for await (const policyDefinition of new PolicyClient(tokenCredential, subscriptionId).policyDefinitions.list({ abortSignal: abortController.signal })) {
                console.log(policyDefinition);
                if (policyDefinition.id === guid && policyDefinition.displayName) {

                    abortController.abort();

                    return new GuidResolverResponse(
                        guid,
                        policyDefinition.displayName,
                        policyDefinition.policyType === 'BuiltIn' 
                        ? 'Azure Policy Definition BuiltIn'
                        : policyDefinition.policyType === 'Static' 
                          ? "Azure Policy Definition Static"
                          : "Azure Policy Definition Custom",
                        policyDefinition,
                        new Date()
                    );
                }
            }
        }
        catch { }

        return undefined;
    }
}
