import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ManagementGroupsAPI  } from "@azure/arm-managementgroups";
import { TokenCredential      } from "@azure/identity";

export class GuidResolverAzureManagementGroup {
    static async resolve(guid: string, tokenCredential: TokenCredential, abortController : AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await new ManagementGroupsAPI(tokenCredential).managementGroups.get(guid, { abortSignal: abortController.signal });

            if (response && response.displayName) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    response.displayName,
                    'Azure ManagementGroup',
                    response,
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
