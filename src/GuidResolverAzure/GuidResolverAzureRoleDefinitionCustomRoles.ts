import { AbortController               } from "@azure/abort-controller"       ;
import { AuthorizationManagementClient } from "@azure/arm-authorization"      ;
import { Mutex                         } from 'async-mutex'                   ;
import { GuidResolverResponse          } from "../Models/GuidResolverResponse";
import { TokenCredential               } from "@azure/identity"               ;

export class GuidResolverAzureRoleDefinitionCustomRoles {
    private readonly client : AuthorizationManagementClient    ;
    private readonly mutex  : Mutex                            ;
    private readonly items  : Map<string, GuidResolverResponse>;

    constructor(
        private readonly onResponse : (guidResolverResponse : GuidResolverResponse) => void,
        tokenCredential: TokenCredential
    ) {
        this.client = new AuthorizationManagementClient(tokenCredential, '/subscriptions');
        this.mutex  = new Mutex()                                                         ;
        this.items  = new Map<string, GuidResolverResponse>()                             ;
    }

    async resolve(guid: string, abortController: AbortController): Promise<GuidResolverResponse | undefined> {
        return this.mutex.runExclusive(async () => {
            try {
                if (this.items.size === 0) {
                    for await (const item of this.client.roleDefinitions.list('', { abortSignal: abortController.signal })) {
                        if (item.name && item.roleName) {
                            const response = new GuidResolverResponse(
                                item.name,
                                item.roleName,
                                item.roleType === 'BuiltInRole'
                                    ? 'Azure RoleDefinition BuiltInRole'
                                    : item.roleType === 'CustomRole'
                                        ? 'Azure RoleDefinition CustomRole'
                                        : 'Azure RoleDefinition Unknown',
                                item,
                                new Date()
                            );

                            this.onResponse(response);

                            this.items.set(item.name, response);
                        }
                    }
                }

                if (this.items.has(guid)) {

                    abortController.abort();

                    return this.items.get(guid);
                }
            }
            catch { }

            return undefined;
        });
    }
}
