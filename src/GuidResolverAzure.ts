import { GuidResolverAzureManagementGroup } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzureRoleDefinition  } from "./GuidResolverAzureRoleDefinition";
import { GuidResolverAzureSubscription    } from "./GuidResolverAzureSubscription";
import { GuidResolverResponse             } from "./Models/GuidResolverResponse";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverAzure {

    readonly guidResolverAzureSubscription   : GuidResolverAzureSubscription   ;
    readonly guidResolverAzureManagementGroup: GuidResolverAzureManagementGroup;
    readonly guidResolverAzureRoleDefinition : GuidResolverAzureRoleDefinition ;

    constructor(
        readonly tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureSubscription    = new GuidResolverAzureSubscription   (tokenCredential);
        this.guidResolverAzureManagementGroup = new GuidResolverAzureManagementGroup(tokenCredential);
        this.guidResolverAzureRoleDefinition  = new GuidResolverAzureRoleDefinition (tokenCredential);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription    = this.guidResolverAzureSubscription   .resolve(guid);
        const promiseAzureManagementGroup = this.guidResolverAzureManagementGroup.resolve(guid);
        const promiseAzureRoleDefinition  = this.guidResolverAzureRoleDefinition .resolve(guid);

        return await promiseAzureSubscription
            ?? await promiseAzureManagementGroup
            ?? await promiseAzureRoleDefinition;
    }
}
