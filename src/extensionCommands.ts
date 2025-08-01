
import { commands, ExtensionContext, OutputChannel, Uri, window, workspace } from 'vscode';
import { GuidCache                                                         } from './GuidCache';
import { GuidLinkProvider                                                  } from './GuidLinkProvider';
import { GuidResolverResponse                                              } from './Models/GuidResolverResponse';
import { GuidResolverResponseToTempFile                                    } from './GuidResolverResponseToTempFile';
import { TelemetryReporter                                                 } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents                                           } from './TelemetryReporterEvents';
import { TokenCredential                                                   } from '@azure/identity';

export function registerCommandOpenLink(context: ExtensionContext, guidCache:GuidCache, tokenCredential : TokenCredential, outputChannel: OutputChannel, telemetryReporter: TelemetryReporter) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.openLink',
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
                    window.showInformationMessage(`${TelemetryReporterEvents.export}  : ${error}`);
                }
                else if (filePath) {
                    outputChannel.appendLine(`${TelemetryReporterEvents.export}  : ${filePath}`);
                    const doc = await workspace.openTextDocument(Uri.file(filePath));
                    await window.showTextDocument(doc, { preview: false });
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

export function registerCommandRefresh(context: ExtensionContext, guidCache: GuidCache) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.refresh',
            () => {
                guidCache.clear();
                window.showInformationMessage('Extension "ohmyguid" - refresh');
            }
        )
    );
}
