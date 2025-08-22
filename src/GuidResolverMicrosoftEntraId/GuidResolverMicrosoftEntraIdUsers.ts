import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IMicrosoftEntraIdInits           } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdUsers extends GuidResolverMicrosoftEntraIdBase implements IMicrosoftEntraIdInits {
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(abortController: AbortController): Promise<void> {
            try {
            const groups = await this.resolveAll('/users', this.onResponse, _ => {_['@odata.type'] = '#microsoft.graph.user'; return _; }, this.onToBeResolved, this.onProgressUpdate, abortController);
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraIdUsers', e);
        }
    }
}
