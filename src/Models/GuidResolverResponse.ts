export class GuidResolverResponse {
    constructor(
        readonly guid       : string,
        readonly displayName: string,
        readonly type       : 'Azure Application Insights Instrumentation Key'
                            | 'Azure Advisor Recommendation'
                            | 'Azure Log Analytics Workspace Customer Id'
                            | 'Azure ManagementGroup' 
                            | 'Azure Policy Definition BuiltIn'
                            | 'Azure Policy Definition Custom'
                            | 'Azure Policy Definition Static'
                            | 'Azure Resources By Tag'
                            | 'Azure RoleDefinition BuiltInRole'
                            | 'Azure RoleDefinition CustomRole'
                            | 'Azure Subscription' 
                            | 'Microsoft Entra ID AppRegistration'
                            | 'Microsoft Entra ID AppRegistration Details'
                            | 'Microsoft Entra ID AppRegistration OAuth2PermissionScope'
                            | 'Microsoft Entra ID AppRoleDefinition'
                            | 'Microsoft Entra ID DirectoryRole'
                            | 'Microsoft Entra ID Group'
                            | 'Microsoft Entra ID Group Details'
                            | 'Microsoft Entra ID ServicePrincipal'
                            | 'Microsoft Entra ID ServicePrincipal Details'
                            | 'Microsoft Entra ID Tenant'
                            | 'Microsoft Entra ID TokenLifetimePolicy'
                            | 'Microsoft Entra ID TokenIssuancePolicy'
                            | 'Microsoft Entra ID User'
                            | 'Microsoft Entra ID User Details',
        readonly object     : any,
        readonly dateTime   : Date
    ) { }
}
