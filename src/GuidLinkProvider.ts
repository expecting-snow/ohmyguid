import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidLinkProvider {

    static resolveLink(item: GuidResolverResponse): string | undefined {
        if (!item) {
            return undefined;
        }

        switch (item.type) {
            case 'Azure Subscription':
                return `https://portal.azure.com/#@/resource/subscriptions/${item.guid}`;
            case 'Azure ManagementGroup':
                return 'https://portal.azure.com/#view/Microsoft_Azure_Resources/ManagementGroupBrowseBlade/~/MGBrowse_overview';
            case 'Microsoft Entra ID AppRegistration':
                return `https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${item.object.appId}/isMSAApp~/false`;
            case 'Microsoft Entra ID AppRegistration Details':
                if (item.object?.appRegistration?.appId) {
                    return `https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/${item.object.appRegistration.appId}/isMSAApp~/false`;
                }
                console.log(`No link available for type: ${item.type}`);
                return undefined;
            case 'Microsoft Entra ID ServicePrincipal':
                    return `https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/${item.object.id}/appId/${item.object.appId}`;
            case 'Microsoft Entra ID ServicePrincipal Details':
                if (item.object?.servicePrincipal?.id && item.object?.servicePrincipal?.appId) {
                    return `https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/Overview/objectId/${item.object.servicePrincipal.id}/appId/${item.object.servicePrincipal.appId}`;
                }
                console.log(`No link available for type: ${item.type}`);
                return undefined;
            case 'Microsoft Entra ID Group':
                return `https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/${item.guid}/menuId/`;
            case 'Microsoft Entra ID Group Details':
                if (item.object?.group?.id) {
                    return `https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupDetailsMenuBlade/~/Overview/groupId/${item.object.group.id}/menuId/`;
                }
                console.log(`No link available for type: ${item.type}`);
                return undefined;
            case 'Microsoft Entra ID User':
                return `https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${item.guid}/hidePreviewBanner~/true`;
            case 'Microsoft Entra ID User Details':
                if (item.object?.user?.id) {
                    return `https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserProfileMenuBlade/~/overview/userId/${item.object.user.id}/hidePreviewBanner~/true`;
                }
                console.log(`No link available for type: ${item.type}`);
                return undefined;
            default:
                console.log(`No link available for type: ${item.type}`);
                return undefined;
        }
    }
}
