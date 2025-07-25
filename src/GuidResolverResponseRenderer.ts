import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverResponseRenderer {
    render(response: GuidResolverResponse | undefined): string {
        if (!response) {
            return '';
        }

        if (response.type === 'Microsoft Entra ID Tenant') {
            return `${response.type}${response.object.displayName ? ` | ${response.object.displayName}` : ''}${response.object.defaultDomainName ? ` | ${response.object.defaultDomainName}` : ''}`;
        }

        return `${response.type} | ${response.displayName}`;
    }
}
