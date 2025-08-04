import { createOutputChannel                                                    } from './extensionCreateOutputChannel';
import { createTelemetryReporter                                                } from './extensionCreateTelemetryReporter';
import { ExtensionContext, window                                               } from 'vscode';
import { GuidResolver                                                           } from './GuidResolver';
import { GuidResolverResponse                                                   } from './Models/GuidResolverResponse';
import { initStaticContent                                                      } from './extensionStaticContent';
import { registerCache                                                          } from './extensionCache';
import { registerCommandLookup, registerCommandOpenLink, registerCommandRefresh } from './extensionCommands';
import { registerGuidCodeLensProvider                                           } from './extensionRegisterGuidCodeLensProvider';
import { resolveTokenProvider                                                   } from './extensionTokenCredential';
import { TelemetryReporterEvents                                                } from './TelemetryReporterEvents';

export async function activate(context: ExtensionContext) {
    const outputChannel = createOutputChannel(context);
    
    outputChannel.appendLine('activate');

    const telemetryReporter = createTelemetryReporter(context);

    const tokenCredential = resolveTokenProvider(outputChannel.appendLine, window.showInformationMessage);

    const guidResolver = new GuidResolver(
        (res  : GuidResolverResponse) => guidCache.update              (res.guid, res),
        (guid : string              ) => guidCache.getResolvedOrEnqueue(guid         ),
        tokenCredential,
        (error: string) => {
            outputChannel.appendLine(`GuidResolver : ${error}`);
            telemetryReporter.sendTelemetryErrorEvent(
                TelemetryReporterEvents.resolve,
                {
                    error: `${error}`
                }
            );
        }
    );

    const guidCache = registerCache(context, guidResolver, outputChannel);

    await initStaticContent(context, guidCache);

    registerGuidCodeLensProvider(context,               guidCache                                                   );
    registerCommandRefresh      (context,               guidCache                                                   );
    registerCommandOpenLink     (context,               guidCache, tokenCredential, outputChannel, telemetryReporter);
    registerCommandLookup       (context, guidResolver, guidCache, tokenCredential, outputChannel, telemetryReporter);
    
    outputChannel.appendLine('activated');

    telemetryReporter.sendTelemetryEvent(TelemetryReporterEvents.activate);
}

export function deactivate() {
    window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}


