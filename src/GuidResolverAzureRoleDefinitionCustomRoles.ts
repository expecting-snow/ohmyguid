import { GuidResolverResponse } from "./Models/GuidResolverResponse";
import { TokenCredential      } from "@azure/identity";
import { AuthorizationManagementClient } from "@azure/arm-authorization";

export class GuidResolverAzureRoleDefinitionCustomRoles {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            for await (const item of new AuthorizationManagementClient(tokenCredential, '/subscriptions').roleDefinitions.list('', { abortSignal: abortController.signal })) {
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
