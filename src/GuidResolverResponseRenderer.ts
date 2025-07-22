import { GuidResolverResponse } from "./Models/GuidResolverResponse";

export class GuidResolverResponseRenderer {
    render(response: GuidResolverResponse | undefined): string {
        if (!response) {
            return '';
        }

        return `${response.type} | ${response.displayName}`;
    }
}
