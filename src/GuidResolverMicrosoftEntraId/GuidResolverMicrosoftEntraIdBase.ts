import { Client, PageCollection, PageIterator, PageIteratorCallback   } from "@microsoft/microsoft-graph-client";
import { GuidResolverResponse                                         } from "../Models/GuidResolverResponse";
import { AdministrativeUnit, Application, AppRoleAssignment, Group, NullableOption, Organization, ServicePrincipal, TenantInformation, PolicyBase, User, DirectoryRole, FederatedIdentityCredential, TokenLifetimePolicy }  from "@microsoft/microsoft-graph-types" ;
import { TokenCredential                                              } from "@azure/identity";
import { TokenCredentialAuthenticationProvider                        } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

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

    protected async resolveGuid(
        path           : string,
        onResponse     : (guidResolverResponse: GuidResolverResponse) => void,
        onToBeResolved : (guid                : string              ) => void,
        abortController: AbortController
    ) : Promise<GuidResolverResponse | undefined> {
        try {
            const response = await this.getClient(abortController).api(path).get();

            const responseMapped = this.processResponse(response, onResponse, onToBeResolved);

            if (responseMapped) {

                abortController.abort();

                return responseMapped;
            }
        } catch { }

        return undefined;
    }

    protected async resolveAll(
        url             : string,
        onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        mapper          : (response             : any                 ) => any,
        onToBeResolved  : (guid                 : string              ) => void,
        onProgressUpdate: (value                : string              ) => void,
        abortController : AbortController,
        defaultVersion? : string,
        returnCollection?: boolean
    ): Promise<any[] | undefined> {
        try {
            var collection: any[] = [];

            const client = this.getClient(abortController, defaultVersion);

            onProgressUpdate(url);
            let counter = 0;

            const response: PageCollection = await client.api(url).get();

            const callback: PageIteratorCallback = (item: any) => {
                counter++;
                if (counter % 50 === 0) {
                    onProgressUpdate(url + ' ' + '.'.repeat(counter / 50));
                }

                this.processResponse(mapper(item), onResponse, onToBeResolved);

                if(returnCollection !== false){
                    collection.push(item);
                }
                return true;
            };

            const pageIterator = new PageIterator(client, response, callback);

            await pageIterator.iterate();

            if (returnCollection !== false) {
                return collection;
            }
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

    protected processResponse(
        response       : any,
        onResponse     : (guidResolverResponse : any   ) => void,
        onToBeResolved : (guid                 : string) => void
    ): GuidResolverResponse | undefined {
        if (!response) { return undefined; }

        if (response.object && response.object["@odata.context"]) {
            return this.processResponse(response.object, onResponse, onToBeResolved);
        }

        if (response['@odata.context'] === 'https://graph.microsoft.com/beta/$metadata#applications/$entity'                 ) { return this.processResponseMicrosoftEntraIdApplication                            (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/beta/$metadata#groups/$entity'                       ) { return this.processResponseMicrosoftEntraIdGroup                                  (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/beta/$metadata#organization/$entity'                 ) { return this.processResponseMicrosoftEntraIdOrganization                           (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/beta/$metadata#servicePrincipals/$entity'            ) { return this.processResponseMicrosoftEntraIdServicePrincipal                       (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/beta/$metadata#users/$entity'                        ) { return this.processResponseMicrosoftEntraIdUser                                   (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#applications/$entity'                 ) { return this.processResponseMicrosoftEntraIdApplication                            (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#directory/administrativeUnits/$entity') { return this.processResponseMicrosoftEntraIdAdministrativeUnit                     (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#groups/$entity'                       ) { return this.processResponseMicrosoftEntraIdGroup                                  (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.tenantInformation'    ) { return this.processResponseMicrosoftEntraIdTenant                                 (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#servicePrincipals/$entity'            ) { return this.processResponseMicrosoftEntraIdServicePrincipal                       (response, onResponse, onToBeResolved); }
        if (response['@odata.context'] === 'https://graph.microsoft.com/v1.0/$metadata#users/$entity'                        ) { return this.processResponseMicrosoftEntraIdUser                                   (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.administrativeUnit'                                             ) { return this.processResponseMicrosoftEntraIdAdministrativeUnit                     (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.application'                                                    ) { return this.processResponseMicrosoftEntraIdApplication                            (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.directoryRole'                                                  ) { return this.processResponseMicrosoftEntraIdDirectoryRole                          (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.group'                                                          ) { return this.processResponseMicrosoftEntraIdGroup                                  (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.organization'                                                   ) { return this.processResponseMicrosoftEntraIdOrganization                           (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.policy'                                                         ) { return this.processResponseMicrosoftEntraIdPolicy                                 (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.servicePrincipal'                                               ) { return this.processResponseMicrosoftEntraIdServicePrincipal                       (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.tenantInformation'                                              ) { return this.processResponseMicrosoftEntraIdTenant                                 (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.tokenLifetimePolicy'                                            ) { return this.processResponseMicrosoftEntraIdTokenLifetimePolicy                    (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === '#microsoft.graph.user'                                                           ) { return this.processResponseMicrosoftEntraIdUser                                   (response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === 'microsoft.graph.application.federatedIdentityCredentials'                        ) { return this.processResponseMicrosoftEntraIdApplicationFederatedIdentityCredentials(response, onResponse, onToBeResolved); }
        if (response['@odata.type'   ] === 'microsoft.graph.appRoleAssignment'                                               ) { return this.processResponseMicrosoftEntraIdAppRoleAssignment                      (response, onResponse, onToBeResolved); }

        console.warn(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdApplicationFederatedIdentityCredentials(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ) : GuidResolverResponse | undefined {
        const federatedIdentityCredential = response as FederatedIdentityCredential;

        if (federatedIdentityCredential && federatedIdentityCredential.id && federatedIdentityCredential.subject) {
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
            const responseMapped = new GuidResolverResponse(
                federatedIdentityCredential.id,
                federatedIdentityCredential.subject,
                'Microsoft Entra ID AppRegistration FederatedIdentityCredential',
                response,
                new Date()
            );

            onResponse(responseMapped);

            if((federatedIdentityCredential as any).resourceId){
                onToBeResolved((federatedIdentityCredential as any).resourceId);
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdTokenLifetimePolicy(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ) : GuidResolverResponse | undefined {
        const tokenLifetimePolicy = response as TokenLifetimePolicy;

        if (tokenLifetimePolicy && tokenLifetimePolicy.id && tokenLifetimePolicy.displayName) {
            const responseMapped = new GuidResolverResponse(
                tokenLifetimePolicy.id,
                tokenLifetimePolicy.displayName,
                'Microsoft Entra ID TokenLifetimePolicy',
                response,
                new Date()
            );

            onResponse(responseMapped);

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }


    private processResponseMicrosoftEntraIdAppRoleAssignment(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ) : GuidResolverResponse | undefined {
        const appRoleAssignment = response as AppRoleAssignment;

        if (appRoleAssignment && appRoleAssignment.appRoleId) {
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
            if (appRoleAssignment.resourceId) {
                onToBeResolved(appRoleAssignment.resourceId);
            }

            return new GuidResolverResponse(
                appRoleAssignment.appRoleId,
                this.mapAppRoleAssignment(response),
                'Microsoft Entra ID AppRoleAssignment',
                response,
                new Date()
            );
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdDirectoryRole(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {
        const directoryRole = response as DirectoryRole;

        if (directoryRole && directoryRole.id && directoryRole.displayName) {
            const responseMapped = new GuidResolverResponse(
                directoryRole.id,
                directoryRole.displayName,
                'Microsoft Entra ID DirectoryRole',
                response,
                new Date()
            );

            onResponse(responseMapped);

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdPolicy(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {
        const policyBase = response as PolicyBase;

        if (policyBase && policyBase.id && response.displayName === 'ClaimIssuancePolicy') {
            const responseMapped = new GuidResolverResponse(
                response.id,
                response.displayName,
                'Microsoft Entra ID ClaimIssuancePolicy',
                response,
                new Date()
            );

            onResponse(responseMapped);

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdTenant(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {
         const tenantInformation = response as TenantInformation;

        if (tenantInformation && tenantInformation.tenantId && tenantInformation.displayName) {
            const responseMapped = new GuidResolverResponse(
                tenantInformation.tenantId,
                tenantInformation.displayName,
                'Microsoft Entra ID Tenant',
                response,
                new Date()
            );

            onResponse(responseMapped);

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdAdministrativeUnit(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {
         const administrativeUnit = response as AdministrativeUnit;

        if (administrativeUnit && administrativeUnit.id && administrativeUnit.displayName) {
            const responseMapped = new GuidResolverResponse(
                administrativeUnit.id,
                administrativeUnit.displayName,
                'Microsoft Entra ID Administrative Unit',
                response,
                new Date()
            );

            onResponse(responseMapped);

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdOrganization(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {
         const organization = response as Organization;

        if (organization && organization.id && organization.displayName) {
            const responseMapped = new GuidResolverResponse(
                organization.id,
                organization.displayName,
                'Microsoft Entra ID Organization',
                organization,
                new Date()
            );

            onResponse(responseMapped);

            if (organization.assignedPlans) {
                for (const assignedPlan of organization.assignedPlans) {
                    if (assignedPlan.servicePlanId) {
                        onResponse(
                            new GuidResolverResponse(
                                assignedPlan.servicePlanId,
                                assignedPlan.service ?? assignedPlan.servicePlanId,
                                'Microsoft Entra ID AssignedPlan',
                                assignedPlan,
                                new Date()
                            )
                        );
                    }
                }
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdGroup(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {

        const group = response as Group;

        if(group && group.id && group.displayName){
            const responseMapped = new GuidResolverResponse(
                group.id,
                group.displayName,
                'Microsoft Entra ID Group',
                response,
                new Date()
            );

            onResponse(responseMapped);

            if (group.mailNickname) {
                // This regular expression (regex) pattern matches GUIDs (Globally Unique Identifiers) within a string
                // and looks for a specific format: five groups of hexadecimal digits separated by hyphens, with the group lengths being 8-4-4-4-12 characters.
                // The negative lookbehind (?<!\/) ensures that the matched GUID is not immediately preceded by a forward slash (/) to avoid matching GUIDs in URLs.
                // The g flag at the end of the regex enables global matching, so it will find all occurrences of GUIDs in the input string, not just the first one.
                const regex = /(?<!\/)([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;

                const match = regex.exec(group.mailNickname);

                if (match) {
                    const guid = match[0];

                    const responseMailNickName = new GuidResolverResponse(
                        guid,
                        group.displayName + ' - mailNickname',
                        'Microsoft Entra ID Group',
                        response,
                        new Date()
                    );

                    onResponse(responseMailNickName);
                }
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdUser(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {

        const user = response as User;

        if(user && user.id && user.userPrincipalName){
            const responseMapped = new GuidResolverResponse(
                user.id,
                user.userPrincipalName,
                'Microsoft Entra ID User',
                response,
                new Date()
            );

            onResponse(responseMapped);

            if (user.appRoleAssignments) {
                /*
                    [
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
                    ]
                */
                const resourceIds = Array.from(
                    new Set<string>(
                        response.appRoleAssignments
                            .select((p: AppRoleAssignment) => p.resourceId)
                            .filter((p: NullableOption<string> | undefined) => p)
                            .map((p: string) => `${p}`)
                    )
                );

                for (const resourceId of resourceIds) {
                    onToBeResolved(resourceId);
                }
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdServicePrincipal(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {

        const servicePrincipal = response as ServicePrincipal;

        if(servicePrincipal && servicePrincipal.id && servicePrincipal.displayName){
            const responseMapped = new GuidResolverResponse(
                servicePrincipal.id,
                servicePrincipal.displayName,
                'Microsoft Entra ID ServicePrincipal',
                response,
                new Date()
            );

            onResponse(responseMapped);

            if (servicePrincipal.appId) {
                onToBeResolved(servicePrincipal.appId);
            }

            if (servicePrincipal.appRoles) {
                for (const appRole of servicePrincipal.appRoles) {
                    if (appRole && appRole.id && appRole.displayName) {
                        if (servicePrincipal.appId) {
                            // add a reference to the appId in the metadata to link back to the app registration that defines the appRole
                            (appRole as any).metadata = {};
                            (appRole as any).metadata.appId = servicePrincipal.appId;
                        }

                        onResponse(
                            new GuidResolverResponse(
                                appRole.id,
                                appRole.displayName,
                                'Microsoft Entra ID AppRoleDefinition',
                                appRole,
                                new Date()
                            )
                        );
                    }
                }
            }

            if (servicePrincipal.oauth2PermissionScopes) {
                //  "oauth2PermissionScopes": [
                //    {
                //      "adminConsentDescription": "Access xyz",
                //      "adminConsentDisplayName": "Access xyz",
                //      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                //      "isEnabled": true,
                //      "type": "User",
                //      "userConsentDescription": null,
                //      "userConsentDisplayName": null,
                //      "value": "access_as_user"
                //    }
                //  ]

                for (const oauth2PermissionScope of servicePrincipal.oauth2PermissionScopes) {
                    if (oauth2PermissionScope && oauth2PermissionScope.id) {
                        if (response.appId) {
                            // add a reference to the appId in the metadata to link back to the app registration that defines the oauth2PermissionScope
                            (oauth2PermissionScope as any).metadata = {};
                            (oauth2PermissionScope as any).metadata.appId = response.appId;
                        }
                        const displayName = response.displayName + ' - ' +
                            oauth2PermissionScope.adminConsentDisplayName
                            || oauth2PermissionScope.userConsentDisplayName
                            || oauth2PermissionScope.adminConsentDescription
                            || oauth2PermissionScope.userConsentDescription
                            || oauth2PermissionScope.value
                            || oauth2PermissionScope.id;

                        onResponse(
                            new GuidResolverResponse(
                                oauth2PermissionScope.id,
                                displayName,
                                'Microsoft Entra ID AppRegistration OAuth2PermissionScope',
                                oauth2PermissionScope,
                                new Date()
                            )
                        );
                    }
                }
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }

    private processResponseMicrosoftEntraIdApplication(
        response       : any,
        onResponse     : (guidResolverResponse: any) => void,
        onToBeResolved : (guid: string) => void
    ): GuidResolverResponse | undefined {

        const application = response as Application;

        if(application && application.id && application.displayName){
            const responseMapped = new GuidResolverResponse(
                application.id,
                application.displayName,
                'Microsoft Entra ID AppRegistration',
                response,
                new Date()
            );

            onResponse(responseMapped);

            if (application.appId) {
                onResponse(
                    new GuidResolverResponse(
                        application.appId,
                        application.displayName,
                        'Microsoft Entra ID AppRegistration',
                        response,
                        new Date()
                    )
                );
            }

            if (application.appRoles) {
                for (const appRole of application.appRoles) {
                    if (appRole && appRole.id && appRole.displayName) {
                        if (application.appId) {
                            // add a reference to the appId in the metadata to link back to the app registration that defines the appRole
                            (appRole as any).metadata = {};
                             (appRole as any).metadata.appId = application.appId;
                        }
                        onResponse(
                            new GuidResolverResponse(
                                appRole.id,
                                appRole.displayName,
                                'Microsoft Entra ID AppRoleDefinition',
                                appRole,
                                new Date()
                            )
                        );
                    }
                }
            }

            if (application.api && application.api.oauth2PermissionScopes) {
                //  "api": {
                //    "oauth2PermissionScopes": [
                //      {
                //        "adminConsentDescription": "Access xyz",
                //        "adminConsentDisplayName": "Access xyz",
                //        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                //        "isEnabled": true,
                //        "type": "User",
                //        "userConsentDescription": null,
                //        "userConsentDisplayName": null,
                //        "value": "access_as_user"
                //      }
                //    ]
                //  }

                for (const oauth2PermissionScope of application.api.oauth2PermissionScopes) {
                    if (oauth2PermissionScope && oauth2PermissionScope.id) {
                        if (application.appId) {
                            // add a reference to the appId in the metadata to link back to the app registration that defines the oauth2PermissionScope
                            (oauth2PermissionScope as any).metadata = {};
                            (oauth2PermissionScope as any).metadata.appId = application.appId;
                        }
                        const displayName = application.displayName + ' - ' +
                            oauth2PermissionScope.adminConsentDisplayName
                            || oauth2PermissionScope.userConsentDisplayName
                            || oauth2PermissionScope.adminConsentDescription
                            || oauth2PermissionScope.userConsentDescription
                            || oauth2PermissionScope.value
                            || oauth2PermissionScope.id;
                        onResponse(
                            new GuidResolverResponse(
                                oauth2PermissionScope.id,
                                displayName,
                                'Microsoft Entra ID AppRegistration OAuth2PermissionScope',
                                oauth2PermissionScope,
                                new Date()
                            )
                        );
                    }
                }
            }

            return responseMapped;
        }

        console.log(`Unknown response type: ${response}`);

        return undefined;
    }
}
