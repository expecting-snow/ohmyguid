import { AbortController                 } from "@azure/abort-controller"       ;
import { EntityInfo, ManagementGroupsAPI } from "@azure/arm-managementgroups"   ;
import { IGuidBatchResolverAzure         } from "../GuidResolver"               ;
import { GuidResolverResponse            } from "../Models/GuidResolverResponse";
import { Mutex                           } from 'async-mutex'                   ;
import { TokenCredential                 } from "@azure/identity"               ;

export class GuidResolverAzureManagementGroups implements IGuidBatchResolverAzure{
    private readonly client: ManagementGroupsAPI;
    private readonly mutex : Mutex              ;

    constructor(
        private readonly onResponse      : (guidResolverResponse : GuidResolverResponse) => void,
        private readonly onToBeResolved  : (guid                 : string              ) => void,
                         tokenCredential : TokenCredential,
        private readonly callbackError   : (error: any) => void
    ) {
        this.client = new ManagementGroupsAPI(tokenCredential);
        this.mutex  = new Mutex()                             ;
    }

    async resolve(abortController: AbortController): Promise<void> {
        try {
            for await (const managementGroup of this.client.entities.list({ abortSignal: abortController.signal }) as AsyncIterableIterator<EntityInfo>) {
                if (managementGroup.id && managementGroup.name) {
                    this.onResponse(
                        new GuidResolverResponse(
                            managementGroup.id,
                            managementGroup.name,
                            'Azure ManagementGroup',
                            managementGroup,
                            new Date()
                        )
                    );
                }
            }
        }
        catch (e: any) {
            this.callbackError(`GuidResolverAzureManagementGroups ${e.message}`);
        }
    }

    async resolveBatch(guids: string[], abortController: AbortController): Promise<string[] | undefined> {
        return this.mutex.runExclusive(async () => {
            const resolvedGuids: string[] = [];

            try {
                for await (const managementGroup of this.client.entities.list({ abortSignal: abortController.signal }) as AsyncIterableIterator<EntityInfo>) {
                    if (managementGroup.id && managementGroup.name) {

                        if (guids.indexOf(managementGroup.id) !== -1) {
                            resolvedGuids.push(managementGroup.id);
                        }

                        this.onResponse(
                            new GuidResolverResponse(
                                managementGroup.id,
                                managementGroup.name,
                                'Azure ManagementGroup',
                                managementGroup,
                                new Date()
                            )
                        );
                    }
                }
            }
            catch (e: any) {
                this.callbackError(`GuidResolverAzureSubscriptions ${e.message}`);
            }

            return resolvedGuids;
        });
    }
}
