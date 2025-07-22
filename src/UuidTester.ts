
export class UuidTester {
    public static isGuid(guid: string): boolean {
        if (!guid || typeof guid !== "string" || guid.trim().length === 0) {
            return false;
        }

        const guidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;

        if (!guidRegex.test(guid)) {
            return false;
        }

        return true;
    }
}
