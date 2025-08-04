import { workspace, ExtensionContext, Uri } from 'vscode';
import { GuidCache                        } from './GuidCache';
import { GuidResolverResponse             } from './Models/GuidResolverResponse';

export async function initStaticContent(context: ExtensionContext, guidCache: GuidCache) {
    await workspace.fs.readFile(
        Uri.joinPath(context.extensionUri, 'static/azure-policies-builtin.json')
    )
    .then(
        data => {
            (JSON.parse(data.toString()) as any[])
            .forEach(
                policy => guidCache.update(
                    policy.name,
                    new GuidResolverResponse(
                        policy.name,
                        policy.displayName,
                        'Azure Policy Definition BuiltIn',
                        policy,
                        new Date()
                    )
                )
            );
        }
    );

    await workspace.fs.readFile(
        Uri.joinPath(context.extensionUri, 'static/azure-policies-static.json')
    )
    .then(
        data => {
            (JSON.parse(data.toString()) as any[])
            .forEach(
                policy => guidCache.update(
                    policy.name,
                    new GuidResolverResponse(
                        policy.name,
                        policy.displayName,
                        'Azure Policy Definition Static',
                        policy,
                        new Date()
                    )
                )
            );
        }
    );

    await workspace.fs.readFile(
        Uri.joinPath(context.extensionUri, 'static/azure-role-definitions-builtin.json')
    )
    .then(
        data => {
            (JSON.parse(data.toString()) as any[])
            .forEach(
                roleDefinition => guidCache.update(
                    roleDefinition.name,
                    new GuidResolverResponse(
                        roleDefinition.name,
                        roleDefinition.roleName,
                        'Azure RoleDefinition BuiltInRole',
                        roleDefinition,
                        new Date()
                    )
                )
            );
        }
    );

    await workspace.fs.readFile(
        Uri.joinPath(context.extensionUri, 'static/azure-advisor-recommendations.json')
    )
    .then(
        data => {
            (JSON.parse(data.toString()) as any[])
            .forEach(
                advsr => guidCache.update(
                    advsr.recommendationTypeId,
                    new GuidResolverResponse(
                        advsr.recommendationTypeId,
                        `${advsr.category} - ${advsr.impact} - ${advsr.impactedField} - ${advsr.shortDescription?.solution}`,
                        'Azure Advisor Recommendation',
                        advsr,
                        new Date()
                    )
                )
            );
        }
    );
}
