import { GuidResolverAzureRoleDefinitionCustomRoles } from "./GuidResolverAzureRoleDefinitionCustomRoles";
import { GuidResolverResponse                       } from "../Models/GuidResolverResponse";
import { TokenCredential                            } from "@azure/identity";

export class GuidResolverAzureRoleDefinition {
    private readonly guidResolverAzureRoleDefinitionCustomRoles: GuidResolverAzureRoleDefinitionCustomRoles;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureRoleDefinitionCustomRoles = new GuidResolverAzureRoleDefinitionCustomRoles(tokenCredential);
    }

    resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseCustomRoles = this.guidResolverAzureRoleDefinitionCustomRoles.resolve(guid, abortController);

        return promiseCustomRoles;
    }
}
