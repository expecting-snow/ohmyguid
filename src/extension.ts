import { createOutputChannel                                                                         } from './extensionCreateOutputChannel'         ;
import { ExtensionContext, window                                                                    } from 'vscode'                                 ;
import { GuidResolver                                                                                } from './GuidResolver'                         ;
import { GuidResolverResponse                                                                        } from './Models/GuidResolverResponse'          ;
import { initStaticContent                                                                           } from './extensionStaticContent'               ;
import { registerCache                                                                               } from './extensionCache'                       ;
import { registerCommandInfo, registerCommandLookup, registerCommandOpenLink, registerCommandRefresh } from './extensionCommands'                    ;
import { registerGuidCodeLensProvider                                                                } from './extensionRegisterGuidCodeLensProvider';
import { resolveTokenProvider                                                                        } from './extensionTokenCredential'             ;

export async function activate(context: ExtensionContext) {
    const outputChannel = createOutputChannel(context);
    
    outputChannel.appendLine('activate');

    const tokenCredential = resolveTokenProvider(outputChannel.appendLine, window.showInformationMessage);

    const guidResolver = new GuidResolver(
        (res  : GuidResolverResponse) => guidCache.update                     (res.guid, res),
        (guid : string              ) => guidCache.getResolvedOrEnqueuePromise(guid         ),
        tokenCredential,
        (error: string) => {
            outputChannel.appendLine(`GuidResolver : ${error}`);
        }
    );

    const guidCache = registerCache(context, guidResolver, outputChannel);
    
    // await guidResolver.init(new AbortController());

    await initStaticContent(context, guidCache);

    registerGuidCodeLensProvider(context, guidCache                                );
    registerCommandRefresh      (context, guidCache, tokenCredential               );
    registerCommandInfo         (context, guidCache, tokenCredential, outputChannel);
    registerCommandOpenLink     (context, guidCache, tokenCredential, outputChannel);
    registerCommandLookup       (context, guidCache, tokenCredential, outputChannel);
    
    outputChannel.appendLine('activated');
}

export function deactivate() {
    window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}


