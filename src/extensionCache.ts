import { ExtensionContext, OutputChannel } from 'vscode';
import { GuidCache                       } from './GuidCache';
import { GuidResolver                    } from './GuidResolver';
import { TelemetryReporter               } from '@vscode/extension-telemetry';
import { TelemetryReporterEvents         } from './TelemetryReporterEvents';
import { TokenCredential                 } from '@azure/identity';


export function registerCache(context: ExtensionContext, tokenCredential: TokenCredential, outputChannel: OutputChannel, telemetryReporter: TelemetryReporter): GuidCache {

    const guidCache = new GuidCache(
        new GuidResolver(
        tokenCredential,
        (error: string) => {
            outputChannel.appendLine(`GuidResolver : ${error}`);
            telemetryReporter.sendTelemetryErrorEvent(
                TelemetryReporterEvents.resolve,
                {
                    error: `${error}`
                }
            );
        }),
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );
    
    context.subscriptions.push(guidCache);
    return guidCache;
}
