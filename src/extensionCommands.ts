import * as vscode                        from 'vscode';
import { GuidCache                      } from './GuidCache'; 
import { GuidLinkProvider               } from './GuidLinkProvider'; 
import { GuidResolverResponse           } from './Models/GuidResolverResponse'; 
import { GuidResolverResponseToTempFile } from './GuidResolverResponseToTempFile'; 
import { TelemetryReporterEvents        } from './TelemetryReporterEvents';
import { TokenCredential                } from '@azure/identity';
import { TelemetryReporter } from '@vscode/extension-telemetry';

export function registerCommandOpenLink(context: vscode.ExtensionContext, guidCache:GuidCache, tokenCredential : TokenCredential, outputChannel: vscode.OutputChannel, telemetryReporter: TelemetryReporter) {
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
}

export function registerCommandRefresh(context: vscode.ExtensionContext, guidCache: GuidCache) {
    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.refresh',
            () => {
                guidCache.clear();
                vscode.window.showInformationMessage('Extension "ohmyguid" - refresh');
            }
        )
    );
}
