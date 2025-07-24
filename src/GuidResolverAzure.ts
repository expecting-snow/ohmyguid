import { GuidResolverAzureManagementGroup } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzureRoleDefinition  } from "./GuidResolverAzureRoleDefinition";
import { GuidResolverAzureSubscription    } from "./GuidResolverAzureSubscription";
import { GuidResolverResponse             } from "./Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverAzure {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription    = GuidResolverAzureSubscription   .resolve(guid, tokenCredential, abortController);
        const promiseAzureManagementGroup = GuidResolverAzureManagementGroup.resolve(guid, tokenCredential, abortController);
        const promiseAzureRoleDefinition  = GuidResolverAzureRoleDefinition .resolve(guid, tokenCredential, abortController);

        return await promiseAzureSubscription
            ?? await promiseAzureManagementGroup
            ?? await promiseAzureRoleDefinition;
    }
}
