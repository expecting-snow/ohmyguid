import { createOutputChannel                                                                                                 } from './extensionCreateOutputChannel'                      ;
import { ExtensionContext, Uri, window, workspace                                                                            } from 'vscode'                                              ;
import { GuidResolver                                                                                                        } from './GuidResolver'                                      ;
import { GuidResolverAzureManagementGroup                                                                                    } from './GuidResolverAzure/GuidResolverAzureManagementGroup';
import { GuidResolverAzureSubscription                                                                                       } from './GuidResolverAzure/GuidResolverAzureSubscription'   ;
import { GuidResolverResponse                                                                                                } from './Models/GuidResolverResponse'                       ;
import { initStaticContent                                                                                                   } from './extensionStaticContent'                            ;
import { registerCache                                                                                                       } from './extensionCache'                                    ;
import { registerCommandInfo, registerCommandLookup, registerCommandOpenLink, registerCommandPreLoad, registerCommandRefresh } from './extensionCommands'                                 ;
import { registerGuidCodeLensProvider                                                                                        } from './extensionRegisterGuidCodeLensProvider'             ;
import { resolveTokenProvider                                                                                                } from './extensionTokenCredential'                          ;

export async function activate(context: ExtensionContext) {
    const outputChannel = createOutputChannel(context);

    outputChannel.appendLine('activate');

    process.on('uncaughtException', (err) => {
        console.log(`Uncaught Exception: ${err.message}`);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log(`unhandledRejection: ${reason}`);
    });

    const tokenCredential = resolveTokenProvider(outputChannel.appendLine, window.showInformationMessage);

    const guidResolver = new GuidResolver(
        (res          : GuidResolverResponse) => guidCache.update                     (res.guid, res),
        (guid         : string              ) => guidCache.getResolvedOrEnqueuePromise(guid         ),
        (progessUpdate: string              ) => outputChannel.appendLine(progessUpdate),
        tokenCredential,
        (error: string) => {
            outputChannel.appendLine(`GuidResolver : ${error}`);
        }
    );

    const guidCache = registerCache(
        context,
        guidResolver,
        new GuidResolverAzureSubscription   (tokenCredential),
        new GuidResolverAzureManagementGroup(tokenCredential),
        outputChannel
    );

    // initStaticContent on first run for this version
    const packageJsonUri = Uri.joinPath(context.extensionUri, 'package.json');
    const packageJsonBytes = await workspace.fs.readFile(packageJsonUri);
    const packageJson = JSON.parse(Buffer.from(packageJsonBytes).toString('utf8'));
    if (packageJson.version) {
        const storedVersion = context.globalState.get<string>('extensionVersion');
        if (storedVersion !== packageJson.version) {
            await initStaticContent(context, guidCache);
            context.globalState.update('extensionVersion', packageJson.version);
        }
    }

    registerGuidCodeLensProvider(context, guidCache                                );
    registerCommandPreLoad      (context, guidResolver                             );
    registerCommandRefresh      (context, guidCache, tokenCredential               );
    registerCommandInfo         (context, guidCache, tokenCredential, outputChannel);
    registerCommandOpenLink     (context, guidCache, tokenCredential, outputChannel);
    registerCommandLookup       (context, guidCache, tokenCredential, outputChannel);

    outputChannel.appendLine('activated');
}

export function deactivate() {
    window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}
