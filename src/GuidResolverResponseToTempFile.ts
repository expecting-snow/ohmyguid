import * as os from 'os';
import * as path from 'path';
import { GuidResolverResponse } from "./Models/GuidResolverResponse";
import { constants, mkdir, writeFile } from 'fs/promises';
import { PathLike } from 'fs';


export class GuidResolverResponseToTempFile {

    constructor(
        private readonly getLink: (item: GuidResolverResponse) => string | undefined
    ) { }

    async toTempFile(guidResolverResponse: GuidResolverResponse): Promise<{ filePath?: string, error?: Error }> {
        const tempDirectory = os.tmpdir();

        if (!tempDirectory) {
            return { error: new Error('Unable to determine temporary directory') };
        }

        try {
            await mkdir(path.join(tempDirectory, 'expecting-snow', 'ohmyguid'), { recursive: true });

            const fileName = `${guidResolverResponse.displayName} ${guidResolverResponse.guid}.json`;

            const filePath = path.join(tempDirectory, 'expecting-snow', 'ohmyguid', fileName);

            await writeFile(
                filePath,
                JSON.stringify(
                    {
                        link: this.getLink(guidResolverResponse) || null,
                        data: guidResolverResponse.object,
                    },
                    null,
                    2
                ),
                {
                    encoding: 'utf8'
                    , flag: 'w'
                    , mode: constants.S_IRUSR | constants.S_IWUSR
                }
            );

            return { filePath };
        }
        catch (e: any) {
            return { error: e };
        }
    }
}
