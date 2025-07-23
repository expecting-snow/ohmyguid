import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdServicePrincipal {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string, abortController: AbortController, abortSignal: AbortSignal): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await Promise.any([
                this.client.api(`/servicePrincipals/${guid}`).get(),
                new Promise<undefined>((resolve, reject) => {
                    abortSignal.addEventListener(
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
                    'Microsoft Entra ID ServicePrincipal',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
