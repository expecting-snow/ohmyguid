import * as vscode from 'vscode';
import { GuidCache } from './GuidCache';
import { GuidResolverResponseRenderer } from "./GuidResolverResponseRenderer";

export class GuidCodeLensProvider implements vscode.CodeLensProvider {

    private readonly guidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;

    constructor(
        readonly guidCache: GuidCache,
        readonly renderer: GuidResolverResponseRenderer
    ) { }

    provideCodeLenses(document: vscode.TextDocument): GuidCodeLens[] {
        const codeLenses: GuidCodeLens[] = [];
        const text = document.getText();

        while (true) {
            const match = this.guidRegex.exec(text);

            if (!match) { break; }

            const guid = match[0];

            const response = this.guidCache.set(guid);

            const codeLens = new GuidCodeLens(
                guid,
                new vscode.Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + guid.length)
                )
            );

            if (response) {
                codeLens.command = {
                    title: this.renderer.render(response) || 'No information available',
                    command: 'ohmyguid.openLink',
                    arguments: [ response ]
                };
            }

            codeLenses.push(codeLens);
        }

        return codeLenses;
    }

    resolveCodeLens(codeLens: GuidCodeLens, token: vscode.CancellationToken): vscode.ProviderResult<GuidCodeLens> {
        const promise = this.guidCache.get(codeLens.guid);
        if (promise) {
            return promise.then(resolvedValue => {
                codeLens.command = {
                    title: this.renderer.render(resolvedValue) || 'No information available',
                    command: 'ohmyguid.openLink',
                    arguments: [ resolvedValue ]
                };
                return codeLens;
            });
        }

        codeLens.command = {
            title: 'No information available',
            command: '',
            arguments: []
        };
        return codeLens;
    }
}

class GuidCodeLens extends vscode.CodeLens {
    guid: string;

    constructor(guid: string, range: vscode.Range, command?: vscode.Command) {
        super(range, command);
        this.guid = guid;
    }
}
