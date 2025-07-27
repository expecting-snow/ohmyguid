import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CachingAzureCliCredential    } from './CachingAzureCliCredential';
import { GuidCache                    } from './GuidCache';
import { GuidCodeLensProvider         } from './GuidCodeLensProvider';
import { GuidLinkProvider             } from './GuidLinkProvider';
import { GuidResolver                 } from './GuidResolver';
import { GuidResolverResponse         } from './Models/GuidResolverResponse';
import { GuidResolverResponseRenderer } from './GuidResolverResponseRenderer';
import { TelemetryReporter            } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents      } from './TelemetryReporterEvents';
import   azurePoliciesBuiltin           from "../static/azure-policies-builtin.json";
import   azurePoliciesStatic            from "../static/azure-policies-static.json";
import   azureRoleDefinitionsBuiltin    from "../static/azure-role-definitions-builtin.json";

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('activate');

    const telemetryReporter = createTelemetryReporter(context);
    context.subscriptions.push(telemetryReporter);

    // context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});

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
        vscode.commands.registerCommand('ohmyguid.clearCache',
            () => {
                guidCache.clear();
                vscode.window.showInformationMessage('Extension "ohmyguid"- cache cleared.');
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.openLink',
            (value: GuidResolverResponse) => {
                var link = GuidLinkProvider.resolveLink(value);
                if (link) {
                    vscode.env.openExternal(vscode.Uri.parse(link));
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


