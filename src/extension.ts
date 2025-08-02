import * as vscode                        from 'vscode';
import { createTelemetryReporter        } from './extensionCreateTelemetryReporter';
import { CachingAzureCliCredential      } from './CachingAzureCliCredential';
import { GuidCache                      } from './GuidCache';
import { GuidCodeLensProvider           } from './GuidCodeLensProvider';
import { GuidResolver                   } from './GuidResolver';
import { GuidResolverResponseRenderer   } from './GuidResolverResponseRenderer';
import { initStaticContent              } from './extensionStaticContent';
import { registerCommandOpenLink, registerCommandRefresh        } from './extensionCommands';
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

    registerCommandRefresh(context, guidCache);
    
    registerCommandOpenLink(context, guidCache, tokenCredential, outputChannel, telemetryReporter);

    outputChannel.appendLine('activated');

    telemetryReporter.sendTelemetryEvent(TelemetryReporterEvents.activate);
}

export function deactivate() {
    vscode.window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}


