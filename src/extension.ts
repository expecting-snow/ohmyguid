import * as vscode from 'vscode';
import { GuidCache                    } from './GuidCache';
import { GuidCodeLensProvider         } from './GuidCodeLensProvider';
import { GuidResolver                 } from './GuidResolver';
import { GuidResolverResponseRenderer } from './GuidResolverResponseRenderer';
import { GuidResolverResponse         } from './Models/GuidResolverResponse';
import { GuidLinkProvider             } from './GuidLinkProvider';
import { CachingAzureCliCredential    } from './CachingAzureCliCredential';

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('activate');

    const guidCache = new GuidCache(
        new GuidResolver(
            new CachingAzureCliCredential(
                value => outputChannel.appendLine(`Authenticate : ${value}`),
                error =>  {
                    outputChannel.appendLine            (`Authenticate : ${error}`);
                    vscode.window.showInformationMessage(`Authenticate : ${error}`);
                }
            )
        ),
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );

    context.subscriptions.push(guidCache);

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

    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.clearCache',
            () => {
                guidCache.clear();
                vscode.window.showInformationMessage('Extension "ohmyguid"- cache cleared.');
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('ohmyguid.openLink',
            (value: GuidResolverResponse) => {
                var link = GuidLinkProvider.resolveLink(value);
                if (link) {
                    vscode.env.openExternal(vscode.Uri.parse(link));
                }
            }
        )
    );

    outputChannel.appendLine('activated');
}

export function deactivate() {
    vscode.window.createOutputChannel('ohmyguid').appendLine('Extension "ohmyguid" - deactivate');
}
