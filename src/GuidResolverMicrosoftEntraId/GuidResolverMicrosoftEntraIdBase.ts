import { Client, PageCollection, PageIterator, PageIteratorCallback } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse                                       } from "../Models/GuidResolverResponse";
import { TokenCredential                                            } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                      } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

export class GuidResolverMicrosoftEntraIdBase {
    constructor(
        private readonly tokenCredential: TokenCredential
    ) { }

    protected getClient(abortController: AbortController, defaultVersion?: string,): Client {
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
            ),
            defaultVersion: defaultVersion || 'v1.0',
        });
    }

    protected async resolveAll(
        url             : string, 
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        mapper          : (response             : any                 ) => any,
        onToBeResolved  : (guid                 : string              ) => void,
        abortController : AbortController,
        defaultVersion? : string
    ): Promise<any[] | undefined> {
        try {
            var collection: any[] = [];

            const response: PageCollection = await this.getClient(abortController, defaultVersion).api(url).get();

            const callback: PageIteratorCallback = (item: any) => {
                 this.processResponses(mapper(item), onResponse, onToBeResolved);
                 collection.push(item); 
                 return true;
            };

            const pageIterator = new PageIterator(this.getClient(abortController, defaultVersion), response, callback);

            await pageIterator.iterate();

            return collection;
        } catch (e: any) {
            console.error(`Error ${url} ${e.message}`);
        }

        return undefined;
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

    protected mapToTypeApplicationFederatedIdentityCredentials(resourceId: string, p: any): any {
        if (p) {
            p['@odata.type'] = 'microsoft.graph.application.federatedIdentityCredentials';
            p.resourceId = resourceId;
        }
        return p;
    }

    protected mapAppRoleAssignment(p: any): string {
        return `${p?.resourceDisplayName} (${p?.principalType}) (${p?.resourceId}) (${p?.appRoleId})`;
    }

    protected processResponses(
        response       : any, 
        onResponse     : (guidResolverResponse : any   ) => void,
        onToBeResolved : (guid                 : string) => void
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
                                createdDateTime: "...",                                                       |
                                principalDisplayName: "...",                                                  |
                                principalId: "...",                                                           |
                                principalType: "User | ServicePrincipal | Group",                             |
                                resourceDisplayName: "app registration display name",                         |
                                resourceId: "app registration guid",                  <------------------------
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

                if (response.appId) {
                    onToBeResolved(response.appId);
                }

                if (response.appRoles) {
                    for (const appRole of response.appRoles) {
                        if (appRole && appRole.id && appRole.displayName) {
                            if (response.appId) {
                                // add a reference to the appId in the metadata to link back to the app registration that defines the appRole
                                appRole.metadata = {};
                                appRole.metadata.appId = response.appId;
                            }
                            onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                        }
                    }
                }

                if (response.oauth2PermissionScopes) {
                    //  "oauth2PermissionScopes": [
                    //    {
                    //      "adminConsentDescription": "Access the DTCNOW Web API",
                    //      "adminConsentDisplayName": "Access DTCNOW Web API",
                    //      "id": "3fed33cf-a131-4f1d-99e5-546f23f01058",
                    //      "isEnabled": true,
                    //      "type": "User",
                    //      "userConsentDescription": null,
                    //      "userConsentDisplayName": null,
                    //      "value": "access_as_user"
                    //    }
                    //  ]

                    for (const oauth2PermissionScope of response.oauth2PermissionScopes) {
                        if (oauth2PermissionScope && oauth2PermissionScope.id) {
                            if (response.appId) {
                                // add a reference to the appId in the metadata to link back to the app registration that defines the oauth2PermissionScope
                                oauth2PermissionScope.metadata = {};
                                oauth2PermissionScope.metadata.appId = response.appId;
                            }
                            const displayName = response.displayName + ' - ' +
                                                oauth2PermissionScope.adminConsentDisplayName
                                             || oauth2PermissionScope.userConsentDisplayName
                                             || oauth2PermissionScope.adminConsentDescription
                                             || oauth2PermissionScope.userConsentDescription
                                             || oauth2PermissionScope.value
                                             || oauth2PermissionScope.id;
                            onResponse(new GuidResolverResponse(oauth2PermissionScope.id, displayName, 'Microsoft Entra ID AppRegistration OAuth2PermissionScope', oauth2PermissionScope, new Date()));
                        }
                    }
                }
            }
            else if (response['@odata.type'] === '#microsoft.graph.application' || response["@odata.context"] === 'https://graph.microsoft.com/v1.0/$metadata#applications/$entity') {
                onResponse(new GuidResolverResponse(response.id, response.displayName, 'Microsoft Entra ID AppRegistration', response, new Date()));

                if(response.appId){
                    onResponse(new GuidResolverResponse(response.appId, response.displayName, 'Microsoft Entra ID AppRegistration', response, new Date()));
                }

                if (response.appRoles) {
                    for (const appRole of response.appRoles) {
                        if (appRole && appRole.id && appRole.displayName) {
                            if (response.appId) {
                                // add a reference to the appId in the metadata to link back to the app registration that defines the appRole
                                appRole.metadata = {};
                                appRole.metadata.appId = response.appId;
                            }
                            onResponse(new GuidResolverResponse(appRole.id, appRole.displayName, 'Microsoft Entra ID AppRoleDefinition', appRole, new Date()));
                        }
                    }
                }

                if (response.api && response.api.oauth2PermissionScopes) {
                    //  "api": {
                    //    "oauth2PermissionScopes": [
                    //      {
                    //        "adminConsentDescription": "Access the DTCNOW Web API",
                    //        "adminConsentDisplayName": "Access DTCNOW Web API",
                    //        "id": "3fed33cf-a131-4f1d-99e5-546f23f01058",
                    //        "isEnabled": true,
                    //        "type": "User",
                    //        "userConsentDescription": null,
                    //        "userConsentDisplayName": null,
                    //        "value": "access_as_user"
                    //      }
                    //    ]
                    //  }

                    for (const oauth2PermissionScope of response.api.oauth2PermissionScopes) {
                        if (oauth2PermissionScope && oauth2PermissionScope.id) {
                            if (response.appId) {
                                // add a reference to the appId in the metadata to link back to the app registration that defines the oauth2PermissionScope
                                oauth2PermissionScope.metadata = {};
                                oauth2PermissionScope.metadata.appId = response.appId;
                            }
                            const displayName = response.displayName + ' - ' +
                                                oauth2PermissionScope.adminConsentDisplayName
                                             || oauth2PermissionScope.userConsentDisplayName
                                             || oauth2PermissionScope.adminConsentDescription
                                             || oauth2PermissionScope.userConsentDescription
                                             || oauth2PermissionScope.value
                                             || oauth2PermissionScope.id;
                            onResponse(new GuidResolverResponse(oauth2PermissionScope.id, displayName, 'Microsoft Entra ID AppRegistration OAuth2PermissionScope', oauth2PermissionScope, new Date()));
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
        else if (response && response.resourceId && response['@odata.type'] === 'microsoft.graph.appRoleAssignment') {
            /*  
                {
                     id: "...not a guid...",
                     deletedDateTime: null,
                     appRoleId: "<guid>", <-- to resolve the appRoleId, resolve the app registration
                     createdDateTime: "...",                                                       |
                     principalDisplayName: "...",                                                  |
                     principalId: "...",                                                           |
                     principalType: "User | ServicePrincipal | Group",                             |
                     resourceDisplayName: "app registration display name",                         |
                     resourceId: "app registration guid",                  <------------------------
                }
            */
            onToBeResolved(response.resourceId);
        }
        else if (response && response.subject && response['@odata.type'] === 'microsoft.graph.application.federatedIdentityCredentials') {
            /*  
                {
                    "@odata.type": "microsoft.graph.application.federatedIdentityCredentials"
                    "id": "<guid>",
                    "name": "...",
                    "issuer": "https://github.com/_services/token",
                    "subject": "repo:...:environment:...",
                    "description": "...",
                    "audiences": [
                        "api://AzureADTokenExchange"
                    ],
                    "@odata.type": "microsoft.graph.application.federatedIdentityCredentials",
                    "resourceId": "<guid>"
                }
            */
            onResponse(
                new GuidResolverResponse(
                    response.id, 
                    response.subject, 
                    'Microsoft Entra ID AppRegistration FederatedIdentityCredential', 
                    response, 
                    new Date()
                )
            );

            onToBeResolved(response.resourceId);
        }
    }
}
