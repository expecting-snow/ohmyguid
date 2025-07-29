import { AuthorizationManagementClient } from "@azure/arm-authorization";
import { GuidResolverResponse          } from "../Models/GuidResolverResponse";
import { TokenCredential               } from "@azure/identity";

export class GuidResolverAzureRoleDefinitionCustomRoles {
    private readonly client: AuthorizationManagementClient;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new AuthorizationManagementClient(tokenCredential, '/subscriptions');
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            for await (const item of this.client.roleDefinitions.list('', { abortSignal: abortController.signal })) {
                if (item.name === guid && item.roleName) {

                    abortController.abort();

                    return new GuidResolverResponse(
                        guid,
                        item.roleName,
                        "Azure RoleDefinition CustomRole",
                        item,
                        new Date()
                    );
                }
            }
        }
        catch { }

        return undefined;
    }
}
