import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverResponseRenderer {
    private readonly separator = '-';

    render(response: GuidResolverResponse | undefined): string {
        if (!response) {
            return '';
        }

        if (response.type === 'Microsoft Entra ID Tenant') {
            return `${response.type}${response.object.displayName ? ` ${this.separator} ${response.object.displayName}` : ''}${response.object.defaultDomainName ? ` ${this.separator} ${response.object.defaultDomainName}` : ''}`;
        }

        if (response.type === 'Azure ManagementGroup') {
             return `${response.type} ${this.separator} ${response.displayName}`;
        }

        if (response.type === 'Microsoft Entra ID User') {
             return `${response.type}${response.object.userPrincipalName ? ` ${this.separator} ${response.object.userPrincipalName}` : ` ${this.separator} ${response.displayName}`}`;
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
        return `${response.type} ${this.separator} ${response.displayName}`;
    }
}
