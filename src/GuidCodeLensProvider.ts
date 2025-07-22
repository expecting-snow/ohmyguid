import * as vscode from 'vscode';
import { GuidCache } from './GuidCache';
import { UuidTester } from './UuidTester';
import { GuidResolverResponseRenderer } from "./GuidResolverResponseRenderer";

export class GuidCodeLensProvider implements vscode.CodeLensProvider {

    private readonly guidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;

    constructor(
        readonly guidCache: GuidCache,
        readonly renderer: GuidResolverResponseRenderer
    ) { }

    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();
        let match: RegExpExecArray | null;
        while ((match = this.guidRegex.exec(text)) !== null) {
            const guid = match[0];

            this.guidCache.set(guid);

            const start = document.positionAt(match.index);
            const end = document.positionAt(match.index + guid.length);

            const codeLens = new vscode.CodeLens(new vscode.Range(start, end));
            (codeLens as any).guid = guid;
            codeLenses.push(codeLens);
        }
        return codeLenses;
    }

    resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.CodeLens | Thenable<vscode.CodeLens> {
        const guid = (codeLens as any).guid;
        if (UuidTester.isGuid(guid)) {
            const promise = this.guidCache.get(guid);
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
        }

        codeLens.command = {
            title: '',
            command: '',
            arguments: []
        };
        return codeLens;
    }
}
