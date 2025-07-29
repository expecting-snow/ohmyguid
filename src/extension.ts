import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CachingAzureCliCredential      } from './CachingAzureCliCredential';
import { GuidCache                      } from './GuidCache';
import { GuidCodeLensProvider           } from './GuidCodeLensProvider';
import { GuidLinkProvider               } from './GuidLinkProvider';
import { GuidResolver                   } from './GuidResolver';
import { GuidResolverResponse           } from './Models/GuidResolverResponse';
import { GuidResolverResponseRenderer   } from './GuidResolverResponseRenderer';
import { TelemetryReporter              } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents        } from './TelemetryReporterEvents';
import   azureAdvisorRecommendations    from "../static/azure-advisor-recommendations.json";
import   azurePoliciesBuiltin           from "../static/azure-policies-builtin.json";
import   azurePoliciesStatic            from "../static/azure-policies-static.json";
import   azureRoleDefinitionsBuiltin    from "../static/azure-role-definitions-builtin.json";
import { GuidResolverResponseToTempFile } from './GuidResolverResponseToTempFile';
import { TokenCredential                } from '@azure/identity';

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('activate');

    const telemetryReporter = createTelemetryReporter(context);
    context.subscriptions.push(telemetryReporter);

    // context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});

    const tokenCredential : TokenCredential = new CachingAzureCliCredential(
    value => outputChannel.appendLine(`Authenticate : ${value}`),
    error =>  {
        outputChannel.appendLine            (`Authenticate : ${error}`);
        vscode.window.showInformationMessage(`Authenticate : ${error}`);
    }
);

    const guidResolver = new GuidResolver(tokenCredential);

    const guidCache = new GuidCache(
        new GuidResolver(
            new CachingAzureCliCredential(
                value => outputChannel.appendLine(`Authenticate : ${value}`),
                error =>  {
                    outputChannel.appendLine            (`Authenticate : ${error}`);
                    vscode.window.showInformationMessage(`Authenticate : ${error}`);
                }
            )
        ),
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );

    // context.workspaceState.keys().forEach(key => { context.workspaceState.update(key, undefined); });

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

    context.subscriptions.push(guidCache);

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            {
                scheme: 'file'
            },
            new GuidCodeLensProvider(
                guidCache,
                new GuidResolverResponseRenderer()
            )
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.refresh',
            () => {
                guidCache.clear();
                vscode.window.showInformationMessage('Extension "ohmyguid" - refresh');
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.openLink',
            async (value: GuidResolverResponse) => {
                const { filePath, error } = await new GuidResolverResponseToTempFile(GuidLinkProvider.resolveLink).toTempFile(value, tokenCredential);

                if (error) {
                    outputChannel.appendLine(`Export : ${error}`);
                    vscode.window.showInformationMessage(`Export : ${error}`);
                }
                else if (filePath) {
                    outputChannel.appendLine(`Export : ${filePath}`);
                    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
                    await vscode.window.showTextDocument(doc, { preview: false });
                }
                else {
                    telemetryReporter.sendTelemetryErrorEvent(
                        TelemetryReporterEvents.export,
                        {
                            error: 'filepath and error are undefined.'
                        }
                    );
                }
            }
        )
    );

    outputChannel.appendLine('activated');

    telemetryReporter.sendTelemetryEvent(TelemetryReporterEvents.activate);
}

export function deactivate() {
    vscode.window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}

/**
 * Returns a {@link TelemetryReporter} with `extensionVersion` from package.json `version`.
 */
export function createTelemetryReporter(context: vscode.ExtensionContext): TelemetryReporter {

    const telemetryConfig = JSON.parse(
        fs.readFileSync(
            path.join(context.extensionPath, 'telemetry.json'),
            'utf8'
        )
    );
    const packageJson = JSON.parse(
        fs.readFileSync(
            path.join(context.extensionPath, 'package.json'),
            'utf8'
        )
    );

    telemetryConfig.commonProperties = telemetryConfig.commonProperties || {};
    telemetryConfig.commonProperties.extensionVersion = packageJson.version;

    return new TelemetryReporter(telemetryConfig.aiKey);
}


