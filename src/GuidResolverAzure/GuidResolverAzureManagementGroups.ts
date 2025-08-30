import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups"   ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureManagementGroups {
    private readonly client: ManagementGroupsAPI;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.client = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            for await (const managementGroup of this.client.entities.list({ abortSignal: abortController.signal })) {
                if (managementGroup.id && managementGroup.name) {
                    this.onResponse(
                        new GuidResolverResponse(
                            managementGroup.id,
                            managementGroup.name,
                            "Azure ManagementGroup",
                            managementGroup,
                            new Date()
                        )
                    );
                }
            }
        }
        catch (e: any) {
            this.callbackError(`GuidResolverAzureManagementGroups ${e.message}`);
        }
    }
}
