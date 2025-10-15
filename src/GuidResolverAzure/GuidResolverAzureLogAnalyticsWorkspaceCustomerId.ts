import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { Mutex                } from 'async-mutex'                   ;
import { ResourceGraphClient  } from "@azure/arm-resourcegraph"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureLogAnalyticsWorkspaceCustomerId {
    private readonly client : ResourceGraphClient              ;
    private readonly mutex  : Mutex                            ;
    private readonly items  : Map<string, GuidResolverResponse>;

    constructor(
        private readonly onResponse: (guidResolverResponse: GuidResolverResponse) => void,
        tokenCredential: TokenCredential
    ) {
        this.client = new ResourceGraphClient(tokenCredential);
        this.mutex  = new Mutex              (               );
        this.items  = new Map<string, GuidResolverResponse>( );
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        return this.mutex.runExclusive(async () => {
            try {
                if (this.items.size === 0) {
                    const query = "resources | where type == 'microsoft.operationalinsights/workspaces' | extend customerId = parse_json(properties).customerId";

                    const result = await this.client.resources({ query, subscriptions: [] }, { abortSignal: abortController.signal });

                    for (const item of result.data) {
                        const itemWithLink : any = item.id && item.tenantId
                                                 ? { _linkAzurePortal: `https://portal.azure.com/#@${item.tenantId}/resource${item.id}/overview` }
                                                 : {};

                        Object.assign(itemWithLink, item);

                        if (itemWithLink.customerId && itemWithLink.name) {
                            const response = new GuidResolverResponse(
                                itemWithLink.customerId,
                                itemWithLink.name,
                                'Azure Log Analytics Workspace Customer Id',
                                itemWithLink,
                                new Date()
                            );

                            this.onResponse(response);

                            this.items.set(item.customerId, response);
                        }
                    }
                }

                if (this.items.has(guid)) {

                    abortController.abort();

                    return this.items.get(guid);
                }
            }
            catch { }

            return undefined;
        });
    }
}
