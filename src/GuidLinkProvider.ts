import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidLinkProvider {

    static resolveLink(item: GuidResolverResponse): string | undefined {
        if (!item) {
            return undefined;
        }

        switch (item.type) {
            case 'Azure Application Insights Instrumentation Key':
                return item.object?.tenantId && item.object?.id
                     ? `https://portal.azure.com/#@${item.object.tenantId}/resource/${item.object.id}/overview`
                     : undefined;

            case 'Azure Subscription':
                return `https://portal.azure.com/#@/resource/subscriptions/${item.guid}`;

            case 'Azure Subscription Details':
                return item.object?.graph?.tenantId
                     ? `https://portal.azure.com/#@${item.object.graph.tenantId}/resource/subscriptions/${item.guid}`
                     : undefined;

            case 'Azure ManagementGroup':
                return 'https://portal.azure.com/#view/Microsoft_Azure_Resources/ManagementGroupBrowseBlade/~/MGBrowse_overview';

            case 'Microsoft Entra ID AppRegistration':
                return `https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${item.object.appId}/isMSAApp~/false`;

            case 'Microsoft Entra ID AppRegistration Details':
                return item.object?.appRegistration?.appId
                     ? `https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${item.object.appRegistration.appId}/isMSAApp~/false`
                     : undefined;

            case 'Microsoft Entra ID ServicePrincipal':
                return `https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/${item.object.id}/appId/${item.object.appId}`;

            case 'Microsoft Entra ID ServicePrincipal Details':
                return item.object?.servicePrincipal?.id && item.object?.servicePrincipal?.appId
                     ? `https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/${item.object.servicePrincipal.id}/appId/${item.object.servicePrincipal.appId}`
                     : undefined;

            case 'Microsoft Entra ID Group':
                return `https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/${item.guid}/menuId/`;

            case 'Microsoft Entra ID Group Details':
                return item.object?.group?.id
                      ? `https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/${item.object.group.id}/menuId/`
                      : undefined;

            case 'Microsoft Entra ID User':
                return `https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${item.guid}/hidePreviewBanner~/true`;

            case 'Microsoft Entra ID User Details':
                return item.object?.user?.id
                     ? `https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${item.object.user.id}/hidePreviewBanner~/true`
                     : undefined;

            case 'Microsoft Entra ID Tenant Details':
                return 'https://portal.azure.com/#view/Microsoft_Azure_Resources/ManagementGroupBrowseBlade/~/MGBrowse_overview';

            case 'Azure ManagementGroup Details':
                return item.object?.managementGroup?.tenantId && item.object?.managementGroup?.name && item.object?.managementGroup?.displayName
                     ? `https://portal.azure.com/#view/Microsoft_Azure_Resources/ManagmentGroupDrilldownMenuBlade/~/overview/tenantId/${item.object.managementGroup.tenantId}/mgId/${item.object.managementGroup.name}/mgDisplayName/${encodeURIComponent(item.object.managementGroup.displayName)}/mgCanAddOrMoveSubscription~/false/mgParentAccessLevel/Not%20Authorized/defaultMenuItemId/overview/drillDownMode~/true`
                     : 'https://portal.azure.com/#view/HubsExtension/ServiceMenuBlade/~/managementgroups/extension/Microsoft_Azure_Resources/menuId/ResourceManager/itemId/managementgroups';

            default:
                console.log(`No link available for type: ${item.type}`);
                return undefined;
        }
    }
}
