import { ExtensionContext, Uri, workspace } from 'vscode';
import * as os from 'os';
import * as path from 'path';

export class DiagnosticsToTempFile {

    constructor(
        private readonly pathSubDirectories = ['expecting-snow', 'ohmyguid']
    ) { }

    async toTempFile(context: ExtensionContext): Promise<{ filePath?: string, error?: Error }> {
        return this.toTempFileInternal();

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

    private async toTempFileInternal(): Promise<{ filePath?: string, error?: Error }> {
        try {
            //throw new Error('This method should not be called directly. Use `toTempFile` instead.');
            const { uri, error } = this.getTempFileUri();

            if (uri === undefined || error) {
                return { error: new Error(`Could not create URI. Error: ${error?.message}`) };
            }

            const fileContent = Buffer.from(JSON.stringify(
                {

                },
                null,
                2
            ), 'utf8');

            // missing directories are created automatically
            await workspace.fs.writeFile(uri, fileContent);

            return { filePath: uri.fsPath };
        }
        catch (e: any) {
            return { error: e };
        }
    }
}
