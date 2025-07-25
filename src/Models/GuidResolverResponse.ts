export class GuidResolverResponse {
    constructor(
        readonly guid       : string,
        readonly displayName: string,
        readonly type       : 'Azure ManagementGroup' 
                            | 'Azure Subscription' 
                            | 'Azure ManagementGroup'
                            | 'Azure RoleDefinition BuiltInRole'
                            | 'Azure RoleDefinition CustomRole'
                            | 'Microsoft Entra ID AppRegistration'
                            | 'Microsoft Entra ID Group'
                            | 'Microsoft Entra ID ServicePrincipal'
                            | 'Microsoft Entra ID Tenant'
                            | 'Microsoft Entra ID User',
        readonly object     : any,
        readonly dateTime   : Date
    ) { }
}
