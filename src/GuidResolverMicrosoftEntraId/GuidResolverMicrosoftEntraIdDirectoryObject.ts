import { GuidResolverMicrosoftEntraIdBase } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse             } from "../Models/GuidResolverResponse";
import { IGuidResolver                    } from "../GuidResolver";
import { TokenCredential                  } from "@azure/identity";

export class GuidResolverMicrosoftEntraIdDirectoryObject extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    constructor(
        tokenCredential: TokenCredential,
        private readonly callbackError: (error: any) => void
    ) { super(tokenCredential); }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(`/directoryObjects/${guid}`).get();

            if (response && response.displayName && response['@odata.type']) {

                     if (response["@odata.type"] === '#microsoft.graph.group'              ) { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID Group'              , response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.user'               ) { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID User'               , response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.servicePrincipal'   ) { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID ServicePrincipal'   , response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.application'        ) { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID AppRegistration'    , response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.tokenLifetimePolicy') { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID TokenLifetimePolicy', response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.tokenIssuancePolicy') { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID TokenIssuancePolicy', response, new Date()); }
                else if (response["@odata.type"] === '#microsoft.graph.directoryRole'      ) { abortController.abort(); return new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID DirectoryRole'      , response, new Date()); }
                else {
                    this.callbackError(`DirectoryObject: Unknown response type: ${response["@odata.type"]}`);
                    return undefined;
                }
            }
        } catch { }

        return undefined;
    }
}
