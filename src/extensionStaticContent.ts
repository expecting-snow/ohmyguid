import { GuidCache                   } from './GuidCache';
import { GuidResolverResponse        } from './Models/GuidResolverResponse';
import   azureAdvisorRecommendations   from "../static/azure-advisor-recommendations.json";
import   azurePoliciesBuiltin          from "../static/azure-policies-builtin.json";
import   azurePoliciesStatic           from "../static/azure-policies-static.json";
import   azureRoleDefinitionsBuiltin   from "../static/azure-role-definitions-builtin.json";

export function initStaticContent(guidCache: GuidCache) {
    (azurePoliciesBuiltin as any[])
        .forEach(policy => guidCache.update(policy.name, new GuidResolverResponse(
            policy.name,
            policy.displayName,
            'Azure Policy Definition BuiltIn',
            policy,
            new Date()
        )));

    (azurePoliciesStatic as any[])
        .forEach(policy => guidCache.update(policy.name, new GuidResolverResponse(
            policy.name,
            policy.displayName,
            'Azure Policy Definition Static',
            policy,
            new Date()
        )));

    (azureRoleDefinitionsBuiltin as any[])
        .forEach(roleDefinition => guidCache.update(roleDefinition.name, new GuidResolverResponse(
            roleDefinition.name,
            roleDefinition.roleName,
            'Azure RoleDefinition BuiltInRole',
            roleDefinition,
            new Date()
        )));

    (azureAdvisorRecommendations as any[])
        .forEach(advsr => guidCache.update(advsr.recommendationTypeId, new GuidResolverResponse(
            advsr.recommendationTypeId,
            `${advsr.category} - ${advsr.impact} - ${advsr.impactedField} - ${advsr.shortDescription?.solution}`,
            'Azure Advisor Recommendation',
            advsr,
            new Date()
        )));
}
