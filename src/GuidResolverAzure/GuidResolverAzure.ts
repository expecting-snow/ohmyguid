import { GuidResolverAzureManagementGroup  } from "./GuidResolverAzureManagementGroup";
import { GuidResolverAzureRoleDefinition   } from "./GuidResolverAzureRoleDefinition" ;
import { GuidResolverAzureSubscription     } from "./GuidResolverAzureSubscription"   ;
import { GuidResolverResponse              } from "../Models/GuidResolverResponse"    ;
import { TokenCredential                   } from "@azure/identity"                   ;

export class GuidResolverAzure {

    private readonly guidResolverAzureSubscription    : GuidResolverAzureSubscription   ;
    private readonly guidResolverAzureManagementGroup : GuidResolverAzureManagementGroup;
    private readonly guidResolverAzureRoleDefinition  : GuidResolverAzureRoleDefinition ;
    
    constructor(
        tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureSubscription    = new GuidResolverAzureSubscription   (tokenCredential);
        this.guidResolverAzureManagementGroup = new GuidResolverAzureManagementGroup(tokenCredential);
        this.guidResolverAzureRoleDefinition  = new GuidResolverAzureRoleDefinition (tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        return await this.guidResolverAzureSubscription   .resolve(guid, abortController)
            ?? await this.guidResolverAzureManagementGroup.resolve(guid, abortController)
            ?? await this.guidResolverAzureRoleDefinition .resolve(guid, abortController);
    }
}
