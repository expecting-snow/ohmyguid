import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdAppRegistration {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await Promise.any([
                this.client.api(`/applications/${guid}`).get(),
                new Promise<undefined>((resolve, reject) => {
                    abortController.signal.addEventListener(
                        'abort',
                        () => {
                            return resolve(undefined);
                        },
                        { once: true }
                    );
                })
            ]);

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
