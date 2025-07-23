import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdServicePrincipalClientId {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await Promise.any([
                this.client.api(`/servicePrincipals`).filter(`appId eq '${guid}'`).get(),
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

            if (response && response.value && response.value.length > 0) {

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
