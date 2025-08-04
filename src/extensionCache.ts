import { ExtensionContext, OutputChannel } from 'vscode';
import { GuidCache                       } from './GuidCache';
import { GuidResolver                    } from './GuidResolver';

export function registerCache(context: ExtensionContext, guidResolver: GuidResolver, outputChannel: OutputChannel): GuidCache {
    const guidCache = new GuidCache(
        guidResolver,
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );
    
    context.subscriptions.push(guidCache);
    
    return guidCache;
}
