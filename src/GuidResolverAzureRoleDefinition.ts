import { GuidResolverAzureRoleDefinitionBuiltInRoles } from "./GuidResolverAzureRoleDefinitionBuiltInRoles";
import { GuidResolverAzureRoleDefinitionCustomRoles  } from "./GuidResolverAzureRoleDefinitionCustomRoles";
import { GuidResolverResponse                        } from "./Models/GuidResolverResponse";
import { TokenCredential                             } from "@azure/identity";

export class GuidResolverAzureRoleDefinition {

    readonly guidResolverAzureRoleDefinitionCustomRoles : GuidResolverAzureRoleDefinitionCustomRoles ;
    readonly guidResolverAzureRoleDefinitionBuiltInRoles: GuidResolverAzureRoleDefinitionBuiltInRoles;

    constructor(
        readonly tokenCredential: TokenCredential,
    ) {
        this.guidResolverAzureRoleDefinitionCustomRoles  = new GuidResolverAzureRoleDefinitionCustomRoles (tokenCredential);
        this.guidResolverAzureRoleDefinitionBuiltInRoles = new GuidResolverAzureRoleDefinitionBuiltInRoles(tokenCredential);
    }

    async resolve(guid: string, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseCustomRoles  = this.guidResolverAzureRoleDefinitionCustomRoles .resolve(guid, abortController);
        const promiseBuiltInRoles = this.guidResolverAzureRoleDefinitionBuiltInRoles.resolve(guid, abortController);

        return await promiseBuiltInRoles
            ?? await promiseCustomRoles;
    }
}
