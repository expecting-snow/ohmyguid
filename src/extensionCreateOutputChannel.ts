import { ExtensionContext, OutputChannel, window } from 'vscode';


export function createOutputChannel(context: ExtensionContext): OutputChannel {
    const outputChannel = window.createOutputChannel('ohmyguid');
    context.subscriptions.push(outputChannel);
    return outputChannel;
}
