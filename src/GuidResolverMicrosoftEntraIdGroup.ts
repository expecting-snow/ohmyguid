import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdGroup {
    constructor(
        readonly client: Client
    ) { }

    async resolve(guid: string, abortController: AbortController, abortSignal: AbortSignal): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await Promise.any([
                this.client.api(`/groups/${guid}`).get(),
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
                    'Microsoft Entra ID Group',
                    response,
                    new Date()
                );
            }
        } catch { }

        return undefined;
    }
}
