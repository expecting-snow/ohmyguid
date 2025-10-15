import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups"   ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureManagementGroup {
    private readonly client: ManagementGroupsAPI;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.client.managementGroups.get(guid, { abortSignal: abortController.signal });

            if (response && response.displayName) {

                const responseWithLink : any = response.tenantId && response.name
                                             ? { _linkAzurePortal: `https://portal.azure.com/#view/Microsoft_Azure_Resources/ManagmentGroupDrilldownMenuBlade/~/overview/tenantId/${response.tenantId}/mgId/${response.name}/mgCanAddOrMoveSubscription~/false/mgParentAccessLevel/Not%20Authorized/defaultMenuItemId/overview/drillDownMode~/true` }
                                             : {};

                Object.assign(responseWithLink, response);

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    responseWithLink.displayName,
                    'Azure ManagementGroup',
                    responseWithLink,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
