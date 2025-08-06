import { ExtensionContext, Uri, workspace } from 'vscode';
import * as os from 'os';
import * as path from 'path';

export class DiagnosticsToTempFile {

    constructor(
        private readonly pathSubDirectories = ['expecting-snow', 'ohmyguid']
    ) { }

    async toTempFile(context: ExtensionContext): Promise<{ filePath?: string, error?: Error }> {
        return this.toTempFileInternal(context);

    }

    getTempFileUri(): { uri?: Uri, error?: Error } {
        try {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const formattedDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
            const rawFileName = `diagnostics-${formattedDate}.json`;

            const fileName = rawFileName.replace(/[^a-zA-Z0-9.\-]/g, '_');

            const tempFileUri = Uri.file(path.join(os.tmpdir(), ...this.pathSubDirectories, fileName));

            return { uri: tempFileUri };
        }
        catch (e: any) {
            return { error: e };
        }
    }

    private async toTempFileInternal(context: ExtensionContext): Promise<{ filePath?: string, error?: Error }> {
        try {
            //throw new Error('This method should not be called directly. Use `toTempFile` instead.');
            const { uri, error } = this.getTempFileUri();

            if (uri === undefined || error) {
                return { error: new Error(`Could not create URI. Error: ${error?.message}`) };
            }

                
            const data = JSON.stringify(
                {
                    extensionKind        : context.extension.extensionKind === 1 
                                               ? 'ui' : context.extension.extensionKind === 2
                                                   ? 'workspace' : context.extension.extensionKind,
                    extensionMode        : context.extensionMode === 1
                                               ? 'Production' : context.extensionMode === 2
                                                   ? 'Development' : context.extensionMode === 3
                                                       ? 'Test' : context.extensionMode,
                    extensionPath        : context.extensionPath           + '',
                    extensionUri         : context.extensionUri    .fsPath + '',
                    globalStorageUri     : context.globalStorageUri.fsPath + '',
                    logUri               : context.logUri          .fsPath + '',
                    storageUri           : context.storageUri     ?.fsPath + '',
                    'workspaceState.keys': context.workspaceState.keys().length,
                },
                null,
                2
            );

            const fileContent = Buffer.from(data, 'utf8');

            // missing directories are created automatically
            await workspace.fs.writeFile(uri, fileContent);

            return { filePath: uri.fsPath };
        }
        catch (e: any) {
            return { error: e };
        }
    }
}
