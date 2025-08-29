import { ExtensionContext, OutputChannel  } from 'vscode'                                              ;
import { GuidCache                        } from './GuidCache'                                         ;
import { GuidResolver                     } from './GuidResolver'                                      ;
import { GuidResolverAzureSubscription    } from './GuidResolverAzure/GuidResolverAzureSubscription'   ;
import { GuidResolverAzureManagementGroup } from './GuidResolverAzure/GuidResolverAzureManagementGroup';

export function registerCache(
    context                         : ExtensionContext                ,
    guidResolver                    : GuidResolver                    ,
    guidResolverAzureSubscription   : GuidResolverAzureSubscription   ,
    guidResolverAzureManagementGroup: GuidResolverAzureManagementGroup,
    outputChannel                   : OutputChannel
) : GuidCache {
    const guidCache = new GuidCache(
        guidResolver,
        guidResolverAzureSubscription,
        guidResolverAzureManagementGroup,
        context.workspaceState,
        value => outputChannel.appendLine(`Cache : ${value}`)
    );

    context.subscriptions.push(guidCache);

    return guidCache;
}
