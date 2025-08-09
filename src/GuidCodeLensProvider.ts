import { CancellationToken, CodeLens, CodeLensProvider, Command, Range, TextDocument } from 'vscode';
import { GuidCache                                                                   } from './GuidCache';
import { GuidResolverResponseRenderer                                                } from "./GuidResolverResponseRenderer";

export class GuidCodeLensProvider implements CodeLensProvider {

    private readonly guidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;

    constructor(
        readonly guidCache: GuidCache,
        readonly renderer: GuidResolverResponseRenderer
    ) { }

    provideCodeLenses(document: TextDocument): GuidCodeLens[] {
        const codeLenses: GuidCodeLens[] = [];
        const text = document.getText();

        while (true) {
            const match = this.guidRegex.exec(text);

            if (!match) { break; }

            const guid = match[0];

            const response = this.guidCache.getResolvedOrEnqueuePromise(guid);

            const codeLens = new GuidCodeLens(
                guid,
                new Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + guid.length)
                )
            );

            if(codeLenses.find(p => p.guid === guid)) {
                // Skip if already added
                continue;
            }

            if (response) {
                codeLens.command = {
                    title: this.renderer.render(response) || '',
                    command: 'ohmyguid.openLink',
                    arguments: [ response ]
                };
            }

            codeLenses.push(codeLens);
        }

        return codeLenses;
    }

    async resolveCodeLens(codeLens: GuidCodeLens, token: CancellationToken) : Promise<GuidCodeLens> {
        const promise = this.guidCache.getResolvedOrResolvePromise(codeLens.guid);
        if (promise) {
            const resolvedValue = await promise;

            if (resolvedValue) {
                codeLens.command = {
                    title: this.renderer.render(resolvedValue) || '',
                    command: 'ohmyguid.openLink',
                    arguments: [resolvedValue]
                };

                return codeLens;
            }
        }

        codeLens.command = {
            title: '',
            command: '',
            arguments: []
        };
        return codeLens;
    }
}

class GuidCodeLens extends CodeLens {
    guid: string;

    constructor(guid: string, range: Range, command?: Command) {
        super(range, command);
        this.guid = guid;
    }
}
