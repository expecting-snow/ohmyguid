
import { commands, ExtensionContext, OutputChannel, Uri, window, workspace } from 'vscode';
import { GuidCache                                                         } from './GuidCache';
import { GuidLinkProvider                                                  } from './GuidLinkProvider';
import { GuidResolverResponse                                              } from './Models/GuidResolverResponse';
import { GuidResolverResponseToTempFile                                    } from './GuidResolverResponseToTempFile';
import { initStaticContent                                                 } from './extensionStaticContent';
import { TelemetryReporter                                                 } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents                                           } from './TelemetryReporterEvents';
import { TokenCredential                                                   } from '@azure/identity';
import { GuidResolver                                                      } from './GuidResolver';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function registerCommandOpenLink(
    context           : ExtensionContext,
    guidCache         : GuidCache,
    tokenCredential   : TokenCredential,
    outputChannel     : OutputChannel,
    telemetryReporter : TelemetryReporter
) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.openLink',
            (value: GuidResolverResponse) => handle(value, guidCache, tokenCredential, outputChannel, telemetryReporter)

        )
    );
}

export function registerCommandRefresh(context: ExtensionContext, guidCache: GuidCache) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.refresh',
            async () => {
                window.showInformationMessage(`${context.extension.id} - refreshing`);
                guidCache.clear();
                context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});
                await initStaticContent(context, guidCache);
                window.showInformationMessage(`${context.extension.id} - refreshed`);
            }
        )
    );
}

export function registerCommandLookup(
    context          : ExtensionContext,
    guidResolver     : GuidResolver,
    guidCache        : GuidCache,
    tokenCredential  : TokenCredential,
    outputChannel    : OutputChannel,
    telemetryReporter: TelemetryReporter
) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.lookup',
            async () => {
                const guid = await window.showInputBox({
                    prompt: 'Please enter a GUID to look up',
                    placeHolder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                });

                if (!guid || !guidRegex.test(guid)) {
                    window.showErrorMessage('Invalid GUID format. Please enter a valid GUID.');
                    return;
                }

                window.showInformationMessage(`${context.extension.id} - Looking up '${guid}'`);

                const value = await guidResolver.resolve(guid);

                if (value) {
                    await handle(value, guidCache, tokenCredential, outputChannel, telemetryReporter);
                }
                else {
                    window.showErrorMessage(`${context.extension.id} - Looking up '${guid}' failed.`);
                }
            }
        )
    );
}

async function handle(
    value            : GuidResolverResponse,
    guidCache        : GuidCache,
    tokenCredential  : TokenCredential,
    outputChannel    : OutputChannel,
    telemetryReporter: TelemetryReporter
) {
    const { filePath, error } = await new GuidResolverResponseToTempFile(
        res => guidCache.update(res.guid, res),
        guid => guidCache.getResolvedOrEnqueue(guid),
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
