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
        private readonly onResponse     : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved : (guid                 : string              ) => void,
        tokenCredential: TokenCredential
    ) { 
        super(tokenCredential); 
        this.managementGroupsAPI = new ManagementGroupsAPI(tokenCredential);
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        try {
            const tenant = await this.getClient(abortController).api(`/tenantRelationships/findTenantInformationByTenantId(tenantId='${guid}')`).get();

            const azureAbortController = new AzureAbortController();
            azureAbortController.signal.addEventListener('abort', () => abortController.abort());

            const managementGroups = [];
            for await (const managementGroup of this.managementGroupsAPI.entities.list({ abortSignal: abortController.signal })) {
                if (managementGroup.tenantId !== guid) {
                    // not in this tenant
                    continue;
                }

                managementGroups.push(managementGroup);
            }

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
                        managementGroupsFlat
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
