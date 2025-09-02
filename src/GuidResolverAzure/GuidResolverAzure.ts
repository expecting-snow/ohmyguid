import { AbortController as AzureAbortController                              } from "@azure/abort-controller"                                 ;
import { GuidResolverAzureApplicationInsightsInstrumentationKey               } from "./GuidResolverAzureApplicationInsightsInstrumentationKey";
import { GuidResolverAzureLogAnalyticsWorkspaceCustomerId                     } from "./GuidResolverAzureLogAnalyticsWorkspaceCustomerId"      ;
import { GuidResolverAzureManagementGroup                                     } from "./GuidResolverAzureManagementGroup"                      ;
import { GuidResolverAzureManagementGroups                                    } from "./GuidResolverAzureManagementGroups"                     ;
import { GuidResolverAzureRoleDefinition                                      } from "./GuidResolverAzureRoleDefinition"                       ;
import { GuidResolverAzureSubscription                                        } from "./GuidResolverAzureSubscription"                         ;
import { GuidResolverAzureSubscriptions                                       } from "./GuidResolverAzureSubscriptions"                        ;
import { GuidResolverAzureTag                                                 } from "./GuidResolverAzureTag"                                  ;
import { GuidResolverResponse                                                 } from "../Models/GuidResolverResponse"                          ;
import { IGuidBatchResolverAzure, IGuidResolverAzure, IGuidResolverInitsAzure } from "../GuidResolver"                                         ;
import { TokenCredential                                                      } from "@azure/identity"                                         ;

export class GuidResolverAzure implements IGuidBatchResolverAzure {
    private readonly guidResolvers      : IGuidResolverAzure     [];
    private readonly guidResolverInits  : IGuidResolverInitsAzure[];
    private readonly guidBatchResolvers : IGuidBatchResolverAzure[];

    constructor(
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        onToBeResolved  : (guid                 : string              ) => void,
        tokenCredential : TokenCredential,
        callbackError   : (error: any) => void
    ) {
        this.guidResolvers = [
            new GuidResolverAzureSubscription                         (            tokenCredential),
            new GuidResolverAzureManagementGroup                      (            tokenCredential),
            new GuidResolverAzureRoleDefinition                       (onResponse, tokenCredential),
            new GuidResolverAzureApplicationInsightsInstrumentationKey(onResponse, tokenCredential),
            new GuidResolverAzureLogAnalyticsWorkspaceCustomerId      (onResponse, tokenCredential),
            new GuidResolverAzureTag                                  (            tokenCredential),
        ];

        this.guidResolverInits = [
            new GuidResolverAzureManagementGroups(onResponse, onToBeResolved, tokenCredential, callbackError),
            new GuidResolverAzureSubscriptions   (onResponse, onToBeResolved, tokenCredential, callbackError),
        ];

        this.guidBatchResolvers = [
            new GuidResolverAzureSubscriptions   (onResponse, onToBeResolved, tokenCredential, callbackError),
            new GuidResolverAzureManagementGroups(onResponse, onToBeResolved, tokenCredential, callbackError),
        ];
    }

    async resolve(guid: string, abortController: AzureAbortController): Promise<GuidResolverResponse | undefined> {
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

    /**
     * Returns the resolved guids.
     */
    async resolveBatch(guids: string[], abortController: AzureAbortController): Promise<string[] | undefined> {
        if (guids.length === 0) { return []; }

        const guidsResolved: string[] = [];
        const guidToBeResolved = new Set<string>(guids);

        try {
            for (const guidBatchResolver of this.guidBatchResolvers) {
                const collection = await guidBatchResolver.resolveBatch(Array.from(guidToBeResolved), abortController);

                if (collection) {
                    for (const item of collection) {
                        guidsResolved   .push  (item);
                        guidToBeResolved.delete(item);
                    }
                }
            }
        } catch (e: any) {
            console.error(e);
        }

        return guidsResolved;
    }

    async init(abortController: AzureAbortController): Promise<void> {
        for (const guidResolver of this.guidResolverInits) {
            await guidResolver.resolve(abortController);
        }
    }
}
