import * as vscode from 'vscode';
import { GuidCache                    } from './GuidCache';
import { GuidCodeLensProvider         } from './GuidCodeLensProvider';
import { GuidResolver                 } from './GuidResolver';
import { GuidResolverResponseRenderer } from './GuidResolverResponseRenderer';
import { GuidResolverResponse         } from './Models/GuidResolverResponse';
import { GuidLinkProvider             } from './GuidLinkProvider';
import { CachingAzureCliCredential    } from './CachingAzureCliCredential';

export function activate(context: vscode.ExtensionContext) {

    console.log('Extension "ohmyguid" - activate');

    const outputChannel = vscode.window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);

    const guidCache = new GuidCache(
        new GuidResolver(
            new CachingAzureCliCredential(
                value => outputChannel.appendLine(`Authentication info: ${value}`),
                error =>  vscode.window.showInformationMessage(`Authentication error: ${error}`)
            )
        )
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

 

    console.log('Extension "ohmyguid" - activated');
}

export function deactivate() {
    console.log('Extension "ohmyguid" - deactivate');
    console.log('Extension "ohmyguid" - deactivated');
}
