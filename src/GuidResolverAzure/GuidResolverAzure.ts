import { AbortController                                        } from "@azure/abort-controller"                                 ;
import { GuidResolverAzureApplicationInsightsInstrumentationKey } from "./GuidResolverAzureApplicationInsightsInstrumentationKey";
import { GuidResolverAzureLogAnalyticsWorkspaceCustomerId       } from "./GuidResolverAzureLogAnalyticsWorkspaceCustomerId"      ;
import { GuidResolverAzureManagementGroup                       } from "./GuidResolverAzureManagementGroup"                      ;
import { GuidResolverAzureManagementGroups                      } from "./GuidResolverAzureManagementGroups"                     ;
import { GuidResolverAzureRoleDefinition                        } from "./GuidResolverAzureRoleDefinition"                       ;
import { GuidResolverAzureSubscription                          } from "./GuidResolverAzureSubscription"                         ;
import { GuidResolverAzureSubscriptions                         } from "./GuidResolverAzureSubscriptions"                        ;
import { GuidResolverAzureTag                                   } from "./GuidResolverAzureTag"                                  ;
import { GuidResolverResponse                                   } from "../Models/GuidResolverResponse"                          ;
import { IGuidResolverAzure, IGuidResolverInitsAzure            } from "../GuidResolver"                                         ;
import { TokenCredential                                        } from "@azure/identity"                                         ;

export class GuidResolverAzure {
    private readonly guidResolvers    : IGuidResolverAzure     [];
    private readonly guidResolverInits: IGuidResolverInitsAzure[];

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.guidResolvers = [
            new GuidResolverAzureSubscription                         (tokenCredential),
            new GuidResolverAzureManagementGroup                      (tokenCredential),
            new GuidResolverAzureRoleDefinition                       (tokenCredential),
            new GuidResolverAzureApplicationInsightsInstrumentationKey(tokenCredential),
            new GuidResolverAzureLogAnalyticsWorkspaceCustomerId      (tokenCredential),
            new GuidResolverAzureTag                                  (tokenCredential),
        ];

        this.guidResolverInits = [
            new GuidResolverAzureManagementGroups(this.onResponse, this.onToBeResolved, tokenCredential, this.callbackError),
            new GuidResolverAzureSubscriptions   (this.onResponse, this.onToBeResolved, tokenCredential, this.callbackError),
        ];
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        for (const guidResolver of this.guidResolvers) {
            try {
                const response = await guidResolver.resolve(guid, abortController);
                if (response) {
                    return response;
                }
            } catch { }
        }
        return undefined;
    }

    async init(abortController: AbortController): Promise<void> {
        for (const guidResolver of this.guidResolverInits) {
            await guidResolver.resolve(abortController);
        }
    }
}
