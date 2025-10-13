import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverResponseRenderer {
    private readonly separator = '-';

    render(response: GuidResolverResponse | undefined): string {
        if (!response) {
            return '';
        }

        if (response.type === 'Empty') {
            return '';
        }

        if (response.type === 'Microsoft Entra ID Tenant') {
            return `${response.type}${response.object.displayName ? ` ${this.separator} ${response.object.displayName}` : ''}${response.object.defaultDomainName ? ` ${this.separator} ${response.object.defaultDomainName}` : ''}`;
        }

        if (response.type === 'Microsoft Entra ID User') {
             return `${response.type}${response.object.userPrincipalName ? ` ${this.separator} ${response.object.userPrincipalName}` : ` ${this.separator} ${response.displayName}`}`;
        }

        if (response.type === 'Microsoft Entra ID AppRegistration') {
            if (response.object?.id === response.guid) {
                return `${response.type} ${this.separator} ${response.displayName} ${this.separator} id`;
            }

            if (response.object?.appId === response.guid) {
                return `${response.type} ${this.separator} ${response.displayName} ${this.separator} appId`;
            }
        }

        if (response.type === 'Microsoft Entra ID ServicePrincipal') {
            if (response.object?.id === response.guid) {
                return `${response.type} ${this.separator} ${response.displayName} ${this.separator} id`;
            }

            if (response.object?.appId === response.guid) {
                return `${response.type} ${this.separator} ${response.displayName} ${this.separator} appId`;
            }
        }

        return `${response.type} ${this.separator} ${response.displayName}`;
    }
}
