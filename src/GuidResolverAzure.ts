import { TokenCredential } from "@azure/identity";
import { GuidResolverAzureSubscription } from "./GuidResolverAzureSubscription";
import { GuidResolverAzureManagementGroup } from "./GuidResolverAzureManagementGroup";
import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverAzure {

    readonly guidResolverAzureSubscription   : GuidResolverAzureSubscription   ;
    readonly guidResolverAzureManagementGroup: GuidResolverAzureManagementGroup;

    constructor(
        readonly tokenCredential: TokenCredential
    ) {
        this.guidResolverAzureSubscription    = new GuidResolverAzureSubscription   (tokenCredential);
        this.guidResolverAzureManagementGroup = new GuidResolverAzureManagementGroup(tokenCredential);
    }

    async resolve(guid: string): Promise<GuidResolverResponse | undefined> {
        const promiseAzureSubscription    = this.guidResolverAzureSubscription   .resolve(guid);
        const promiseAzureManagementGroup = this.guidResolverAzureManagementGroup.resolve(guid);

        return await promiseAzureSubscription
            ?? await promiseAzureManagementGroup;
    }
}
