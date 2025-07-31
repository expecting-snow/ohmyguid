import { Client, PageCollection, PageIterator, PageIteratorCallback } from "@microsoft/microsoft-graph-client";
import { TokenCredential                                            } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                      } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { GuidResolverResponse } from "../Models/GuidResolverResponse";

export class GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly tokenCredential: TokenCredential
    ) { }

    protected getClient(abortController: AbortController): Client {
        return Client.initWithMiddleware({
            fetchOptions: {
                signal: abortController.signal
            },
            authProvider: new TokenCredentialAuthenticationProvider(
                this.tokenCredential, {
                getTokenOptions: {
                    abortSignal: abortController.signal
                },
                scopes: [
                    'https://graph.microsoft.com/.default'
                ]
            }
            )
        });
    }

    protected async resolveAll(url: string, abortController: AbortController): Promise<any[] | undefined> {
        try {
            var collection: any[] = [];

            const response: PageCollection = await this.getClient(abortController).api(url).get();

            const callback: PageIteratorCallback = (item: any) => { collection.push(item); return true; };

            const pageIterator = new PageIterator(this.getClient(abortController), response, callback);

            await pageIterator.iterate();

            return collection;
        } catch {
            return undefined;
        }
    }

    protected mapIdDisplayName(p: any): { displayName: string; id: string } {
        return { 
            displayName: p?.displayName,
            id         : p?.id
        };
    }

    protected processResponses(responses: any, onResponse: (guidResolverResponse: any) => void): void {
        const collection = responses as any[];
        if (collection) {
            for (const response of collection) {
                if (response && response.id && response.displayName && (response["@odata.type"] || response["@odata.context"])) {
                    if (response["@odata.type"] === '#microsoft.graph.group' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#groups/$entity') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID Group', response, new Date()));
                    }
                    else if (response["@odata.type"] === '#microsoft.graph.user' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#users/$entity') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID User', response, new Date()));
                    }
                    else if (response["@odata.type"] === '#microsoft.graph.servicePrincipal'|| response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#servicePrincipals/$entity') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID ServicePrincipal', response, new Date()));

                        if (response.appRoles) {
                            for (const appRole of response.appRoles) {
                                if (appRole && appRole.id && appRole.displayName) {
                                    onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                                }
                            }
                        }
                    }
                    else if (response["@odata.type"] === '#microsoft.graph.application' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#applications/$entity') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID AppRegistration', response, new Date()));

                        if (response.appRoles) {
                            for (const appRole of response.appRoles) {
                                if (appRole && appRole.id && appRole.displayName) {
                                    onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                                }
                            }
                        }
                    }
                    else if (response["@odata.type"] === '#microsoft.graph.tokenLifetimePolicy') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID TokenLifetimePolicy', response, new Date()));
                    }
                    else if (response["@odata.type"] === '#microsoft.graph.directoryRole') {
                        onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID DirectoryRole', response, new Date()));
                    }
                    else{
                        console.warn(`Unknown response type: ${response["@odata.type"]} for id: ${response.id}`);
                    }
                }
            }
        }
    }
}
