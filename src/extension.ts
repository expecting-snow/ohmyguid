import { createOutputChannel                             } from './extensionCreateOutputChannel';
import { createTelemetryReporter                         } from './extensionCreateTelemetryReporter';
import { ExtensionContext, window                        } from 'vscode';
import { initStaticContent                               } from './extensionStaticContent';
import { registerCache                                   } from './extensionCache';
import { registerCommandOpenLink, registerCommandRefresh } from './extensionCommands';
import { registerGuidCodeLensProvider                    } from './extensionRegisterGuidCodeLensProvider';
import { resolveTokenProvider                            } from './extensionTokenCredential';
import { TelemetryReporterEvents                         } from './TelemetryReporterEvents';

export function activate(context: ExtensionContext) {
    // context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});

    const outputChannel = createOutputChannel(context);
    
    outputChannel.appendLine('activate');

    const telemetryReporter = createTelemetryReporter(context);

    const tokenCredential = resolveTokenProvider(outputChannel.appendLine, window.showInformationMessage);

    const guidCache = registerCache(context, tokenCredential, outputChannel, telemetryReporter);

    initStaticContent(guidCache);

    registerGuidCodeLensProvider(context, guidCache);

    registerCommandRefresh(context, guidCache);

    registerCommandOpenLink(context, guidCache, tokenCredential, outputChannel, telemetryReporter);

    outputChannel.appendLine('activated');

    telemetryReporter.sendTelemetryEvent(TelemetryReporterEvents.activate);
}

export function deactivate() {
    window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}


