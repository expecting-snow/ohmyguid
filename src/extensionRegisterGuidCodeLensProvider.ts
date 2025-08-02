
import { ExtensionContext, languages  } from 'vscode';
import { GuidCache                    } from './GuidCache';
import { GuidCodeLensProvider         } from './GuidCodeLensProvider';
import { GuidResolverResponseRenderer } from './GuidResolverResponseRenderer';

export function registerGuidCodeLensProvider(context: ExtensionContext, guidCache: GuidCache) {
    context.subscriptions.push(
        languages.registerCodeLensProvider(
            {
                scheme: 'file'
            },
            new GuidCodeLensProvider(
                guidCache,
                new GuidResolverResponseRenderer()
            )
        )
    );
}
