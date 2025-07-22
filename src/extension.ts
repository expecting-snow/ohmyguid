import * as vscode from 'vscode';
import { AzureCliCredential           } from '@azure/identity';
import { GuidCache                    } from './GuidCache';
import { GuidCodeLensProvider         } from './GuidCodeLensProvider';
import { GuidResolver                 } from './GuidResolver';
import { GuidResolverResponseRenderer } from './GuidResolverResponseRenderer';
import { GuidResolverResponse         } from './Models/GuidResolverResponse';
import { GuidLinkProvider             } from './GuidLinkProvider';

export function activate(context: vscode.ExtensionContext) {

    console.log('Extension "ohmyguid" - activate');

    const guidCache = new GuidCache(new GuidResolver(new AzureCliCredential()));

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
