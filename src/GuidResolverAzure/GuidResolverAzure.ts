import { GuidResolverAzureApplicationInsightsInstrumentationKey } from "./GuidResolverAzureApplicationInsightsInstrumentationKey";
import { GuidResolverAzureLogAnalyticsWorkspaceCustomerId       } from "./GuidResolverAzureLogAnalyticsWorkspaceCustomerId"      ;
import { GuidResolverAzureManagementGroup                       } from "./GuidResolverAzureManagementGroup"                      ;
import { GuidResolverAzureRoleDefinition                        } from "./GuidResolverAzureRoleDefinition"                       ;
import { GuidResolverAzureSubscription                          } from "./GuidResolverAzureSubscription"                         ;
import { GuidResolverAzureTag                                   } from "./GuidResolverAzureTag"                                  ;
import { GuidResolverResponse                                   } from "../Models/GuidResolverResponse"                          ;
import { IGuidResolver                                          } from "../GuidResolver"                                         ;
import { TokenCredential                                        } from "@azure/identity"                                         ;

export class GuidResolverAzure {
    private readonly guidResolvers: IGuidResolver[];

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.guidResolvers = [
            new GuidResolverAzureSubscription                         (tokenCredential),
            new GuidResolverAzureManagementGroup                      (tokenCredential),
            new GuidResolverAzureRoleDefinition                       (tokenCredential),
            new GuidResolverAzureApplicationInsightsInstrumentationKey(tokenCredential),
            new GuidResolverAzureLogAnalyticsWorkspaceCustomerId      (tokenCredential),
            new GuidResolverAzureTag                                  (tokenCredential),
        ];
    }
    
    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        for (const guidResolver of this.guidResolvers) {
            const response = await guidResolver.resolve(guid, abortController);
            if (response) {
                return response;
            }
        }
        return undefined;
    }
}
