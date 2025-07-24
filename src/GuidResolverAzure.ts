import { GuidResolverAzureManagementGroup            } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzureRoleDefinitionBuiltInRoles } from "./GuidResolverAzureRoleDefinitionBuiltInRoles";
import { GuidResolverAzureSubscription               } from "./GuidResolverAzureSubscription";
import { GuidResolverResponse                        } from "./Models/GuidResolverResponse";
import { TokenCredential                             } from "@azure/identity";

export class GuidResolverAzure {

    readonly guidResolverAzureSubscription               : GuidResolverAzureSubscription              ;
    readonly guidResolverAzureManagementGroup            : GuidResolverAzureManagementGroup           ;
    readonly guidResolverAzureRoleDefinitionBuiltInRoles : GuidResolverAzureRoleDefinitionBuiltInRoles;

    constructor(
        readonly tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureSubscription                = new GuidResolverAzureSubscription              (tokenCredential);
        this.guidResolverAzureManagementGroup             = new GuidResolverAzureManagementGroup           (tokenCredential);
        this.guidResolverAzureRoleDefinitionBuiltInRoles  = new GuidResolverAzureRoleDefinitionBuiltInRoles(tokenCredential);
    }

    async resolve(guid: string, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription    = this.guidResolverAzureSubscription              .resolve(guid, abortController);
        const promiseAzureManagementGroup = this.guidResolverAzureManagementGroup           .resolve(guid, abortController);
        const promiseAzureRoleDefinition  = this.guidResolverAzureRoleDefinitionBuiltInRoles.resolve(guid, abortController);

        return await promiseAzureSubscription
            ?? await promiseAzureManagementGroup
            ?? await promiseAzureRoleDefinition;
    }
}
