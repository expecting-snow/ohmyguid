import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverResponseRenderer {
    render(response: GuidResolverResponse | undefined): string {
        if (!response) {
            return '';
        }

        if (response.type === 'Microsoft Entra ID Tenant') {
            return `${response.type}${response.object.displayName ? ` | ${response.object.displayName}` : ''}${response.object.defaultDomainName ? ` | ${response.object.defaultDomainName}` : ''}`;
        }

        if (response.type === 'Azure ManagementGroup') {
             return `${response.type} | ${response.displayName}`;
        }

        if (response.type === 'Microsoft Entra ID User') {
             return `${response.type}${response.object.userPrincipalName ? ` | ${response.object.userPrincipalName}` : ` | ${response.displayName}`}`;
        }

        // '' 
        // | 'Azure Subscription' 
        // | 'Azure ManagementGroup'
        // | 'Azure RoleDefinition BuiltInRole'
        // | 'Azure RoleDefinition CustomRole'
        // | 'Microsoft Entra ID AppRegistration'
        // | 'Microsoft Entra ID Group'
        // | 'Microsoft Entra ID ServicePrincipal'
        // | 'Microsoft Entra ID Tenant'
        // | 'Microsoft Entra ID User'
        return `${response.type} | ${response.displayName}`;
    }
}
