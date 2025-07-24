import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "../Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdAppRegistration {
    static async resolve(client: Client, guid: string, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await client.api(`/applications/${guid}`).get();

            if (response && response.displayName) {
                
                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Microsoft Entra ID AppRegistration',
                    response,
                    new Date()
                );
            }
        } catch { }
        
        return undefined;
    }
}
