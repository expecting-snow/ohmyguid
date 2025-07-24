import { GuidResolverAzureRoleDefinitionBuiltInRoles } from "./GuidResolverAzureRoleDefinitionBuiltInRoles";
import { GuidResolverAzureRoleDefinitionCustomRoles  } from "./GuidResolverAzureRoleDefinitionCustomRoles";
import { GuidResolverResponse                        } from "./Models/GuidResolverResponse";
import { TokenCredential                             } from "@azure/identity";

export class GuidResolverAzureRoleDefinition {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseCustomRoles  = GuidResolverAzureRoleDefinitionCustomRoles .resolve(guid, tokenCredential, abortController);
        const promiseBuiltInRoles = GuidResolverAzureRoleDefinitionBuiltInRoles.resolve(guid, tokenCredential, abortController);

        return await promiseBuiltInRoles
            ?? await promiseCustomRoles;
    }
}
