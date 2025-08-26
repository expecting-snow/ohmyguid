import { GuidResolverMicrosoftEntraIdBase   } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse               } from "../Models/GuidResolverResponse";
import { IGuidResolverInitsMicrosoftEntraId } from "../GuidResolver";
import { TokenCredential                    } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdGroups extends GuidResolverMicrosoftEntraIdBase implements IGuidResolverInitsMicrosoftEntraId {
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            this.onProgressUpdate('/groups/$count');
            const count = await this.getClient(abortController, 'beta').api('/groups/$count').header('ConsistencyLevel', 'eventual').get();

            if (count > 1000) {
                this.onProgressUpdate(`Too many groups (${count}). Skipping detailed resolution.`);
            } else {
                await this.resolveAll('/groups', this.onResponse, _ => { _['@odata.type'] = '#microsoft.graph.group'; return _; }, this.onToBeResolved, this.onProgressUpdate, abortController, 'v1.0', false);
            }
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraIdGroups', e);
        }
    }
}
