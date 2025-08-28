import { GuidResolverMicrosoftEntraIdBase   } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse               } from "../Models/GuidResolverResponse";
import { IGuidResolverInitsMicrosoftEntraId } from "../GuidResolver";
import { TokenCredential                    } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdServicePrincipals extends GuidResolverMicrosoftEntraIdBase implements IGuidResolverInitsMicrosoftEntraId {
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            this.onProgressUpdate('/servicePrincipals/$count');
            const count = await this.getClient(abortController, 'beta').api('/servicePrincipals/$count').header('ConsistencyLevel', 'eventual').get();

            if (count > 1000) {
                this.onProgressUpdate(`Too many servicePrincipals (${count}). Skipping detailed resolution.`);
            } else {
                await this.resolveAll('/servicePrincipals', this.onResponse, _ => {_['@odata.type'] = '#microsoft.graph.servicePrincipal'; return _; }, this.onToBeResolved, this.onProgressUpdate, abortController, 'v1.0', false);
            }
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraIdServicePrincipals', e);
        }
    }
}
