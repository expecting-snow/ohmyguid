import { Client, PageCollection, PageIterator, PageIteratorCallback } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse                                       } from "../Models/GuidResolverResponse";
import { TokenCredential                                            } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                      } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

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

    protected async resolveAll(
        url             : string, 
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        mapper          : (response             : any                 ) => any,
        onToBeResolved  : (guid                 : string              ) => void,
        abortController : AbortController
    ): Promise<any[] | undefined> {
        try {
            var collection: any[] = [];

            const response: PageCollection = await this.getClient(abortController).api(url).get();

            const callback: PageIteratorCallback = (item: any) => {
                 this.processResponses(mapper(item), onResponse, onToBeResolved);
                 collection.push(item); 
                 return true;
            };

            const pageIterator = new PageIterator(this.getClient(abortController), response, callback);

            await pageIterator.iterate();

            return collection;
        } catch {
            return undefined;
        }
    }

    protected mapIdDisplayName1(p: any): { displayName: string; id: string } {
        return { 
            displayName: p?.displayName,
            id         : p?.id
        };
    }
    protected mapIdDisplayName(p: any): string {
        if(p.userPrincipalName) {
            return `${p?.userPrincipalName} (${p?.id})`;
        }

        return `${p?.displayName} (${p?.id})`;
    }

    protected mapToTypeApproleAssignment(p: any): any {
        if (p) {
            p['@odata.type'] = 'microsoft.graph.appRoleAssignment';
        }
        return p;
    }

    protected mapAppRoleAssignment(p: any): string {
        return `${p?.resourceDisplayName} (${p?.principalType}) (${p?.resourceId}) (${p?.appRoleId})`;
    }

    protected processResponses(
        response: any, 
        onResponse: (guidResolverResponse: any) => void,
        onToBeResolved: (guid: string) => void
    ): void {
        if (response && response.id && response.displayName && (response['@odata.type'] || response["@odata.context"])) {
            if (response['@odata.type'] === '#microsoft.graph.group' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#groups/$entity') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID Group', response, new Date()));
            }
            else if (response['@odata.type'] === '#microsoft.graph.user' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#users/$entity') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID User', response, new Date()));
                
                if (response.appRoleAssignments) {
                     for (const item of response.appRoleAssignments) {
                        /*  
                            {
                                id: "...not a guid...",
                                deletedDateTime: null,
                                appRoleId: "<guid>", <-- to resolve the appRoleId, resolve the app registration
                                createdDateTime: "...",                                  |
                                principalDisplayName: "...",                             |
                                principalId: "...",                                      |
                                principalType: "User | ServicePrincipal | Group",        |
                                resourceDisplayName: "app registration display name",    |
                                resourceId: "app registration guid",                  <--
                            }
                        */
                        if (item.resourceId) {
                            onToBeResolved(item.resourceId);
                        }
                    }
                }   
            }
            else if (response['@odata.type'] === '#microsoft.graph.servicePrincipal' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#servicePrincipals/$entity') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID ServicePrincipal', response, new Date()));

                if (response.appRoles) {
                    for (const appRole of response.appRoles) {
                        if (appRole && appRole.id && appRole.displayName) {
                            onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                        }
                    }
                }
            }
            else if (response['@odata.type'] === '#microsoft.graph.application' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#applications/$entity') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID AppRegistration', response, new Date()));

                if (response.appRoles) {
                    for (const appRole of response.appRoles) {
                        if (appRole && appRole.id && appRole.displayName) {
                            onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                        }
                    }
                }
            }
            else if (response['@odata.type'] === '#microsoft.graph.tokenLifetimePolicy') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID TokenLifetimePolicy', response, new Date()));
            }
            else if (response['@odata.type'] === '#microsoft.graph.directoryRole') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID DirectoryRole', response, new Date()));
            }
            else {
                console.warn(`Unknown response type: ${response['@odata.type']} for id: ${response.id}`);
            }
        }
        else if (response && response['@odata.type'] === 'microsoft.graph.appRoleAssignment') {
            /*  
                {
                     id: "...not a guid...",
                     deletedDateTime: null,
                     appRoleId: "<guid>", <-- to resolve the appRoleId, resolve the app registration
                     createdDateTime: "...",                                  |
                     principalDisplayName: "...",                             |
                     principalId: "...",                                      |
                     principalType: "User | ServicePrincipal | Group",        |
                     resourceDisplayName: "app registration display name",    |
                     resourceId: "app registration guid",                  <--
                }
            */
            if (response.resourceId) {
                onToBeResolved(response.resourceId);
            }
        }
    }
}
