
import { CachingAzureCliCredential                                                                           } from './CachingAzureCliCredential'     ;
import { commands, env, ExtensionContext, InputBoxValidationSeverity, OutputChannel, Uri,  window, workspace } from 'vscode'                          ;
import { Events                                                                                              } from './Events'       ;
import { GuidCache                                                                                           } from './GuidCache'                     ;
import { GuidLinkProvider                                                                                    } from './GuidLinkProvider'              ;
import { GuidResolverResponse                                                                                } from './Models/GuidResolverResponse'   ;
import { GuidResolverResponseToTempFile                                                                      } from './GuidResolverResponseToTempFile';
import { initStaticContent                                                                                   } from './extensionStaticContent'        ;
import { jwtDecode                                                                                           } from "jwt-decode"                      ;
import { TokenCredential                                                                                     } from '@azure/identity'                 ;

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function registerCommandOpenLink(
    context           : ExtensionContext,
    guidCache         : GuidCache,
    tokenCredential   : TokenCredential,
    outputChannel     : OutputChannel
) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.openLink',
            (value: GuidResolverResponse) => { 
                window.showInformationMessage(`${context.extension.id} - '${value.guid}'`);

                const resolutionType = 'details';

                return handle(value, guidCache, tokenCredential, outputChannel, resolutionType);
            }
        )
    );
}

export function registerCommandRefresh(context: ExtensionContext, guidCache: GuidCache, tokenCredential: TokenCredential) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.refresh',
            async () => {
                window.showInformationMessage(`${context.extension.id} - refreshing`);
                await (tokenCredential as CachingAzureCliCredential).clear();
                guidCache.clear();
                context.workspaceState.keys().forEach(key => {context.workspaceState.update(key, undefined);});
                await initStaticContent(context, guidCache);
                window.showInformationMessage(`${context.extension.id} - refreshed`);
            }
        )
    );
}

export function registerCommandInfo(
    context: ExtensionContext,
    guidCache: GuidCache,
    tokenCredential: TokenCredential,
    outputChannel: OutputChannel
) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.info',
            async () => {
                const getToken = async (tokenCredential: TokenCredential, scopes: string | string[]) => {
                    try {
                        const token = await tokenCredential.getToken(scopes);

                        if (!token) {
                            return undefined;
                        }

                        const response = {
                            token: {
                                accessToken          : token.token,
                                expiresOnTimestamp   : token.expiresOnTimestamp    ? new Date(token.expiresOnTimestamp   ).toLocaleString() : undefined,
                                refreshAfterTimestamp: token.refreshAfterTimestamp ? new Date(token.refreshAfterTimestamp).toLocaleString() : undefined,
                                tokenType            : token.tokenType,
                            },
                            tokenDecoded: {
                                header : jwtDecode(token.token, { header: true  }),
                                payload: jwtDecode(token.token, { header: false })
                            }
                        };

                        return response;
                    }
                    catch {
                        return undefined;
                    }
                };

                const getTokens = async (tokenCredential: TokenCredential) => {
                    const scopes = [
                        'https://management.azure.com/.default',
                        'https://graph.microsoft.com/.default'
                    ];

                    const responses = await Promise.all(
                        scopes.map(
                            async scope => (
                                {
                                    name      : scope,
                                    credential: await getToken(tokenCredential, scope)
                                }
                            )
                        )
                    );

                    return responses.sort((a, b) => a.name.localeCompare(b.name));
                };

                const data = JSON.stringify(
                    {
                        extension:{                        
                            'extension.id'          : context.extension.id,
                            extensionKind           : context.extension.extensionKind === 1 
                                                    ? 'ui' : context.extension.extensionKind === 2
                                                        ? 'workspace' : context.extension.extensionKind,
                            extensionMode           : context.extensionMode === 1
                                                    ? 'Production' : context.extensionMode === 2
                                                        ? 'Development' : context.extensionMode === 3
                                                            ? 'Test' : context.extensionMode,
                            extensionPath           : context.extensionPath           + '',
                            extensionUri            : context.extensionUri    .fsPath + '',
                            globalStorageUri        : context.globalStorageUri.fsPath + '',
                            logUri                  : context.logUri          .fsPath + '',
                            storageUri              : context.storageUri     ?.fsPath + '',
                            'workspaceState.keys'   : context.workspaceState.keys().length,
                            'extension.packageJSON' : context.extension.packageJSON,
                        },
                        credentials : await getTokens(tokenCredential) 
                    },
                    null,
                    2
                );

                const document = await workspace.openTextDocument({ content: data, language: 'json' });

                await window.showTextDocument(document, { preview: false });
            }
        )
    );
}

export function registerCommandLookup(
    context          : ExtensionContext,
    guidCache        : GuidCache,
    tokenCredential  : TokenCredential,
    outputChannel    : OutputChannel
) {
    context.subscriptions.push(
        commands.registerCommand('ohmyguid.lookup',
            async () => {
                const value = await env.clipboard.readText();

                const prompt      = 'Please enter a GUID to look up';
                const placeHolder = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
                const validateInput = (value: string) => {
                    /**
                     * InputBoxValidationSeverity
                     * 
                     * The severity of the validation message.
                     * NOTE: When using `InputBoxValidationSeverity.Error`, the user will not be allowed to accept (hit ENTER) the input.
                     * `Info` and `Warning` will still allow the InputBox to accept the input.
                     */
                    return value && guidRegex.test(value)
                        ? ''
                        : {
                            message: 'Invalid guid',
                            severity: InputBoxValidationSeverity.Error
                        };
                };

                const guid = value && guidRegex.test(value)
                    ? await window.showInputBox({ prompt, placeHolder, value, validateInput})
                    : await window.showInputBox({ prompt, placeHolder       , validateInput});

                if (!guid || !guidRegex.test(guid)) {
                    window.showErrorMessage('Invalid GUID format. Please enter a valid GUID.');
                    return;
                }

                window.showInformationMessage(`${context.extension.id} - '${guid}'`);

                const guidResolverResponse = await guidCache.getResolvedOrResolvePromise(guid);

                if (guidResolverResponse) {
                    const resolutionType = '';
                    await handle(guidResolverResponse, guidCache, tokenCredential, outputChannel, resolutionType);
                } else {
                    window.showErrorMessage(`${context.extension.id} - ERROR - '${guid}'`);
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
    resolutionType   : '' | 'details'
) {
    const guidResolverResponseToTempFile = new GuidResolverResponseToTempFile(
        res => guidCache.update(res.guid, res),
        guid => guidCache.getResolvedOrEnqueuePromise(guid),
        GuidLinkProvider.resolveLink,
        (error: string) => {
            outputChannel.appendLine(`${Events.export} : ${error}`);
        }
    );

    const { guidResolverResponse, filePath, error } = await guidResolverResponseToTempFile.toTempFile(value, resolutionType, tokenCredential);

    if (error) {
        outputChannel.appendLine(`${Events.export} : ${error}`);
        window.showErrorMessage(`${Events.export}  : ${error}`);

        const cachedFileFalllback = guidResolverResponseToTempFile.getTempFileUri(guidResolverResponse);

        if (!cachedFileFalllback.error && cachedFileFalllback.uri) {
            const cachedDoc = await workspace.openTextDocument(cachedFileFalllback.uri);
            await window.showTextDocument(cachedDoc, { preview: false });
        }
        else{
            window.showErrorMessage(`${Events.export}  : ${error}`);
        }
    }
    else if (filePath) {
        outputChannel.appendLine(`${Events.export} : ${filePath}`);
        const doc = await workspace.openTextDocument(Uri.file(filePath));
        await window.showTextDocument(doc, { preview: false });
    }
    else {
        outputChannel.appendLine(`${Events.export} : ${error}`);
    }
}
