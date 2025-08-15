import { AbortController      } from "@azure/abort-controller"       ;
import { GuidResolverResponse } from "../Models/GuidResolverResponse";
import { ResourceGraphClient  } from "@azure/arm-resourcegraph"      ;
import { TokenCredential      } from "@azure/identity"               ;

export class GuidResolverAzureApplicationInsightsInstrumentationKey {
    private readonly client: ResourceGraphClient;

    constructor(
        tokenCredential: TokenCredential
    ) {
        this.client = new ResourceGraphClient(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const query = `resources | where type == 'microsoft.insights/components' | extend instrumentationKey = parse_json(properties).InstrumentationKey | where instrumentationKey == '${guid}'`;

            const result = await this.client.resources({ query, subscriptions: [] }, { abortSignal: abortController.signal });

            if (result.count > 0 && result.data[0].instrumentationKey === guid && result.data[0].name) {

                abortController.abort();

                return new GuidResolverResponse(
                    guid,
                    result.data[0].name,
                    'Azure Application Insights Instrumentation Key',
                    result.data[0],
                    new Date()
                );
            }
        }
        catch { }

        return undefined;
    }
}
