import { GuidResolverMicrosoftEntraIdBase   } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse               } from "../Models/GuidResolverResponse";
import { IGuidResolverInitsMicrosoftEntraId } from "../GuidResolver";
import { TokenCredential                    } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdDirectoryRoles extends GuidResolverMicrosoftEntraIdBase implements IGuidResolverInitsMicrosoftEntraId {
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            await this.resolveAll('/directoryRoles', this.onResponse, _ => { _['@odata.type'] = '#microsoft.graph.directoryRole'; return _; }, this.onToBeResolved, this.onProgressUpdate, abortController, 'v1.0', false);
        } catch (e: any) {
            console.error('GuidResolverMicrosoftEntraIdDirectoryRoles', e);
        }
    }
}
