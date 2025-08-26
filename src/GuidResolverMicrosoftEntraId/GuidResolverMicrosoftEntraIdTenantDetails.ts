import { AbortController as AzureAbortController } from "@azure/abort-controller"           ;
import { AzureManagementGroups                   } from "../AzureManagementGroups";
import { GuidResolverMicrosoftEntraIdBase        } from "./GuidResolverMicrosoftEntraIdBase";
import { GuidResolverResponse                    } from "../Models/GuidResolverResponse"    ;
import { IGuidResolver                           } from "../GuidResolver"                   ;
import { ManagementGroupsAPI                     } from "@azure/arm-managementgroups"       ;
import { TokenCredential                         } from "@azure/identity"                   ;

export class GuidResolverMicrosoftEntraIdTenantDetails extends GuidResolverMicrosoftEntraIdBase implements IGuidResolver {
    private readonly managementGroupsAPI: ManagementGroupsAPI;
    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
        private readonly onProgressUpdate: (value                : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential); 
        this.managementGroupsAPI = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const azureAbortController = new AzureAbortController();
            azureAbortController.signal.addEventListener('abort', () => abortController.abort());

            this.onProgressUpdate(`/tenantRelationships/findTenantInformationByTenantId(tenantId='${guid}')`);
            const tenant = await this.getClient(abortController).api(`/tenantRelationships/findTenantInformationByTenantId(tenantId='${guid}')`).get();


            this.onProgressUpdate('managementGroupsAPI.entities.list');
            const managementGroups = [];
            for await (const managementGroup of this.managementGroupsAPI.entities.list({ abortSignal: abortController.signal })) {
                if (managementGroup.tenantId !== guid) {
                    // not in this tenant
                    continue;
                }

                managementGroups.push(managementGroup);
            }
            this.onProgressUpdate('/organization');
            const organization = await this.getClient(abortController, 'beta').api('/organization').get();

            this.onProgressUpdate('/subscribedSkus');
            const subscribedSkus = await this.getClient(abortController, 'beta').api('/subscribedSkus').get();

            this.onProgressUpdate('/devices/$count'     ); const devicesCount      = await this.getClient(abortController, 'beta').api('/devices/$count'     ).header('ConsistencyLevel', 'eventual').get();
            this.onProgressUpdate('/applications/$count'); const applicationsCount = await this.getClient(abortController, 'beta').api('/applications/$count').header('ConsistencyLevel', 'eventual').get();
            this.onProgressUpdate('/groups/$count'      ); const groupsCount       = await this.getClient(abortController, 'beta').api('/groups/$count'      ).header('ConsistencyLevel', 'eventual').get();
            this.onProgressUpdate('/users/$count'       ); const usersCount        = await this.getClient(abortController, 'beta').api('/users/$count'       ).header('ConsistencyLevel', 'eventual').get();
            // /policies/authenticationmethodspolicy
            // /directory/recommendations
            // /reports/healthmonitoring/alerts
 
            if (tenant && tenant.displayName) {
                this.processResponses(tenant, this.onResponse, this.onToBeResolved);

                abortController.abort();

                const managementGroupsHierarchy = new AzureManagementGroups().resolveRoot(managementGroups);
                const managementGroupsFlat = managementGroupsHierarchy?.flatten();


                return new GuidResolverResponse(
                    guid,
                    tenant.displayName,
                    'Microsoft Entra ID Tenant Details',
                    {
                        tenant,
                        count: {
                            devices     : devicesCount,
                            applications: applicationsCount,
                            groups      : groupsCount,
                            users       : usersCount
                        },
                        managementGroupsFlat,
                        organization,
                        subscribedSkus,
                    },
                    new Date()
                );
            }
        } catch (e: any) {
            console.error('Error resolving GUID:', e);
        }

        return undefined;
    }
}
