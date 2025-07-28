export class GuidResolverResponse {
    constructor(
        readonly guid       : string,
        readonly displayName: string,
        readonly type       : 'Azure Advisor Recommendation'
                            | 'Azure ManagementGroup'
                            | 'Azure ManagementGroup' 
                            | 'Azure Policy Definition BuiltIn'
                            | 'Azure Policy Definition Custom'
                            | 'Azure Policy Definition Static'
                            | 'Azure RoleDefinition BuiltInRole'
                            | 'Azure RoleDefinition CustomRole'
                            | 'Azure Subscription' 
                            | 'Microsoft Entra ID AppRegistration'
                            | 'Microsoft Entra ID Group'
                            | 'Microsoft Entra ID ServicePrincipal'
                            | 'Microsoft Entra ID Tenant'
                            | 'Microsoft Entra ID User',
        readonly object     : any,
        readonly dateTime   : Date
    ) { }
}
