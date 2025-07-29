import { GuidResolverAzureManagementGroup  } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzureRoleDefinition   } from "./GuidResolverAzureRoleDefinition";
import { GuidResolverAzureSubscription     } from "./GuidResolverAzureSubscription";
import { GuidResolverResponse              } from "../Models/GuidResolverResponse";
import { TokenCredential                   } from "@azure/identity";

export class GuidResolverAzure {

    private readonly guidResolverAzureSubscription    : GuidResolverAzureSubscription;
    private readonly guidResolverAzureManagementGroup : GuidResolverAzureManagementGroup;
    private readonly guidResolverAzureRoleDefinition  : GuidResolverAzureRoleDefinition;
    
    constructor(
        private readonly tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureSubscription     = new GuidResolverAzureSubscription    (this.tokenCredential);
        this.guidResolverAzureManagementGroup  = new GuidResolverAzureManagementGroup (this.tokenCredential);
        this.guidResolverAzureRoleDefinition   = new GuidResolverAzureRoleDefinition  (this.tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription    = this.guidResolverAzureSubscription   .resolve(guid, abortController);
        const promiseAzureManagementGroup = this.guidResolverAzureManagementGroup.resolve(guid, abortController);
        const promiseAzureRoleDefinition  = this.guidResolverAzureRoleDefinition .resolve(guid, abortController);

        return await promiseAzureSubscription
            ?? await promiseAzureManagementGroup
            ?? await promiseAzureRoleDefinition;
    }
}
