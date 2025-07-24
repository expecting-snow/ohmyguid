import { Client               } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse } from "../Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdServicePrincipalClientId {
    static async resolve(client: Client, guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await client.api(`/servicePrincipals`).filter(`appId eq '${guid}'`).get();

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
