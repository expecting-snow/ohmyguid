import { GuidResolverAzureManagementGroup  } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzurePolicyDefinition } from "./GuidResolverAzurePolicyDefinition";
import { GuidResolverAzureRoleDefinition   } from "./GuidResolverAzureRoleDefinition";
import { GuidResolverAzureSubscription     } from "./GuidResolverAzureSubscription";
import { GuidResolverResponse              } from "../Models/GuidResolverResponse";
import { TokenCredential                   } from "@azure/identity";

export class GuidResolverAzure {
    static async resolve(guid: string, azureSubscriptionIds: string[], tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription     = GuidResolverAzureSubscription    .resolve(guid, tokenCredential, abortController);
        const promiseAzureManagementGroup  = GuidResolverAzureManagementGroup .resolve(guid, tokenCredential, abortController);
        const promiseAzureRoleDefinition   = GuidResolverAzureRoleDefinition  .resolve(guid, tokenCredential, abortController);

        {
            const response = await promiseAzureSubscription
                ?? await promiseAzureManagementGroup
                ?? await promiseAzureRoleDefinition;

            if (response) {
                abortController.abort();
                return response;
            }
        }

        {
            const response = await GuidResolverAzurePolicyDefinition.resolve(guid, azureSubscriptionIds, tokenCredential, abortController);

            if (response) {
                abortController.abort();
                return response;
            }
        }

        return undefined;
    }
}
