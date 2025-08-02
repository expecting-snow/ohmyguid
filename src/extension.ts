import * as fs                            from 'fs';
import * as path                          from 'path';
import * as vscode                        from 'vscode';
import { CachingAzureCliCredential      } from './CachingAzureCliCredential';
import { GuidCache                      } from './GuidCache';
import { GuidCodeLensProvider           } from './GuidCodeLensProvider';
import { GuidLinkProvider               } from './GuidLinkProvider';
import { GuidResolver                   } from './GuidResolver';
import { GuidResolverResponse           } from './Models/GuidResolverResponse';
import { GuidResolverResponseRenderer   } from './GuidResolverResponseRenderer';
import { GuidResolverResponseToTempFile } from './GuidResolverResponseToTempFile';
import { initStaticContent              } from './extensionStaticContent';
import { TelemetryReporter              } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents        } from './TelemetryReporterEvents';
import { TokenCredential                } from '@azure/identity';

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('activate');

    const telemetryReporter = createTelemetryReporter(context);
    context.subscriptions.push(telemetryReporter);

    // context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});

    const tokenCredential: TokenCredential = new CachingAzureCliCredential(
        (value: string) => outputChannel.appendLine(`Authenticate : ${value}`),
        (error: string) => {
            outputChannel.appendLine(`Authenticate : ${error}`);
            vscode.window.showInformationMessage(`Authenticate : ${error}`);
        }
    );

    const guidResolver = new GuidResolver(
        tokenCredential,
        (error: string) => {
            outputChannel.appendLine(`GuidResolver : ${error}`);
            telemetryReporter.sendTelemetryErrorEvent(
                TelemetryReporterEvents.resolve,
                {
                    error: `${error}`
                }
            );
        });

    const guidCache = new GuidCache(
        guidResolver,
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );
    
    context.subscriptions.push(guidCache);

    initStaticContent(guidCache);

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
                const { filePath, error } = await new GuidResolverResponseToTempFile(
                    res => guidCache.update(res.guid, res),
                    GuidLinkProvider.resolveLink,
                    (error: string) => {
                        outputChannel.appendLine(`${TelemetryReporterEvents.export} : ${error}`);
                        telemetryReporter.sendTelemetryErrorEvent(
                            TelemetryReporterEvents.export,
                            {
                                error: `${error}`
                            }
                        );
                    }
                ).toTempFile(value, tokenCredential);

                if (error) {
                    outputChannel.appendLine(`${TelemetryReporterEvents.export}  : ${error}`);
                    vscode.window.showInformationMessage(`${TelemetryReporterEvents.export}  : ${error}`);
                }
                else if (filePath) {
                    outputChannel.appendLine(`${TelemetryReporterEvents.export}  : ${filePath}`);
                    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
                    await vscode.window.showTextDocument(doc, { preview: false });
                }
                else {
                    outputChannel.appendLine(`${TelemetryReporterEvents.export} : ${error}`);
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


