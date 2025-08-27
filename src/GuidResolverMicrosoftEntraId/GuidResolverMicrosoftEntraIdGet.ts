import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";


export class GuidResolverMicrosoftEntraIdGet extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        private readonly getPath       : (guid: string                              ) => string,
        private readonly onResponse    : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved: (guid: string                              ) => void,
        tokenCredential: TokenCredential
    ) { super(tokenCredential); }

    resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        return this.resolveGuid(this.getPath(guid), this.onResponse, this.onToBeResolved, abortController);
    }
}
