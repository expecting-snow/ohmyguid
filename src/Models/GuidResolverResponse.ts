export class GuidResolverResponse {
    static readonly EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    static readonly EMPTY_RESPONSE = new GuidResolverResponse(GuidResolverResponse.EMPTY_GUID, '', 'Empty', {}, new Date());


    constructor(
        readonly guid       : string,
        readonly displayName: string,
        readonly type       : GuidResolverResponseType,
        readonly object     : any,
        readonly dateTime   : Date
    ) { }
}

export type GuidResolverResponseType =
  'Empty'
  | 'Azure Advisor Recommendation'
  | 'Azure Application Insights Instrumentation Key'
  | 'Azure Log Analytics Workspace Customer Id'
  | 'Azure ManagementGroup'
  | 'Azure ManagementGroup Details'
  | 'Azure Policy Definition BuiltIn'
  | 'Azure Policy Definition Custom'
  | 'Azure Policy Definition Static'
  | 'Azure Resources By Tag'
  | 'Azure RoleDefinition BuiltInRole'
  | 'Azure RoleDefinition CustomRole'
  | 'Azure Subscription'
  | 'Azure Subscription Details'
  | 'Microsoft Entra ID AppRegistration Details'
  | 'Microsoft Entra ID AppRegistration OAuth2PermissionScope'
  | 'Microsoft Entra ID AppRegistration'
  | 'Microsoft Entra ID AppRegistration FederatedIdentityCredential'
  | 'Microsoft Entra ID AppRoleDefinition'
  | 'Microsoft Entra ID DirectoryRole'
  | 'Microsoft Entra ID Group Details'
  | 'Microsoft Entra ID Group'
  | 'Microsoft Entra ID ServicePrincipal Details'
  | 'Microsoft Entra ID ServicePrincipal'
  | 'Microsoft Entra ID Tenant'
  | 'Microsoft Entra ID Tenant Details'
  | 'Microsoft Entra ID TokenIssuancePolicy'
  | 'Microsoft Entra ID TokenLifetimePolicy'
  | 'Microsoft Entra ID User Details'
  | 'Microsoft Entra ID User'
;
