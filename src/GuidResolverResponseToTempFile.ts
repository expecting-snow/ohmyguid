import { GuidResolverAzureManagementGroup                        } from './GuidResolverAzure/GuidResolverAzureManagementGroup'                                  ;
import { GuidResolverAzureRoleDefinitionCustomRoles              } from './GuidResolverAzure/GuidResolverAzureRoleDefinitionCustomRoles'                        ;
import { GuidResolverAzureSubscription                           } from './GuidResolverAzure/GuidResolverAzureSubscription'                                     ;
import { GuidResolverMicrosoftEntraIdAppRegistrationWithDetails  } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdAppRegistrationWithDetails' ;
import { GuidResolverMicrosoftEntraIdGroupWithDetails            } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdGroupWithDetails'           ;
import { GuidResolverMicrosoftEntraIdServicePrincipalWithDetails } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdServicePrincipalWithDetails';
import { GuidResolverMicrosoftEntraIdTenant                      } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdTenant'                     ;
import { GuidResolverMicrosoftEntraIdUserWithDetails             } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdUserWithDetails'            ;
import { GuidResolverResponse                                    } from "./Models/GuidResolverResponse"                                                         ;
import { TokenCredential                                         } from '@azure/identity'                                                                       ;
import * as os            from 'os';
import * as path          from 'path';
import { Uri, workspace } from 'vscode';



export class GuidResolverResponseToTempFile {

    constructor(
        private readonly onResponse    : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved: (guid                : string              ) => void,
        private readonly getLink       : (item                : GuidResolverResponse) => string | undefined,
        private readonly callbackError : (error               : string              ) => void,
        private readonly pathSubDirectories = ['expecting-snow', 'ohmyguid']
    ) { }

    async toTempFile(guidResolverResponse: GuidResolverResponse, fileNameSuffix: '' | 'details', tokenCredential: TokenCredential): Promise<{ filePath?: string, error?: Error }>{
        if(fileNameSuffix === '') {
            return this.toTempFileInternal(guidResolverResponse, fileNameSuffix);
        }
        
        const responseType    = guidResolverResponse.type;
        const guid            = guidResolverResponse.guid;
        const abortController = new AbortController();

        switch (responseType) {
            case 'Azure Advisor Recommendation'       : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                           , fileNameSuffix);
            case 'Azure Policy Definition BuiltIn'    : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                           , fileNameSuffix);
            case 'Azure Policy Definition Custom'     : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                           , fileNameSuffix);
            case 'Azure Policy Definition Static'     : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                           , fileNameSuffix);
            case 'Azure RoleDefinition BuiltInRole'   : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                           , fileNameSuffix);
            case 'Azure ManagementGroup'              : return this.toTempFileInternal(await new GuidResolverAzureManagementGroup                       (                                      tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Azure RoleDefinition CustomRole'    : return this.toTempFileInternal(await new GuidResolverAzureRoleDefinitionCustomRoles             (                                      tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Azure Subscription'                 : return this.toTempFileInternal(await new GuidResolverAzureSubscription                          (                                      tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Microsoft Entra ID AppRegistration' : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdAppRegistrationWithDetails (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Microsoft Entra ID Group'           : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdGroupWithDetails           (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Microsoft Entra ID ServicePrincipal': return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdServicePrincipalWithDetails(this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Microsoft Entra ID Tenant'          : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdTenant                     (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            case 'Microsoft Entra ID User'            : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdUserWithDetails            (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid, abortController) ?? guidResolverResponse, fileNameSuffix);
            default:
                this.callbackError(`ResponseToTempFile: Unknown response type: ${responseType}`);
                return this.toTempFileInternal(guidResolverResponse, fileNameSuffix);
        }
    }

    async getTempFileUri(guidResolverResponse: GuidResolverResponse, fileNameSuffix: string): Promise<{ uri?: Uri, error?: Error }> {
        try {
            const rawFileName = `${guidResolverResponse.type}--`
                + `${guidResolverResponse.guid}--`
                + `${guidResolverResponse.displayName}`
                + `${fileNameSuffix ? `--${fileNameSuffix}` : ''}`
                + `.json`;

            const fileName = rawFileName.replace(/[^a-zA-Z0-9.\-]/g, '_');

            const tempFileUri = Uri.file(path.join(os.tmpdir(), ...this.pathSubDirectories, fileName));

            return { uri: tempFileUri };
        }
        catch (e: any) {
            return { error: e };
        }
    }

    private async toTempFileInternal(guidResolverResponse: GuidResolverResponse, fileNameSuffix: string): Promise<{ filePath?: string, error?: Error }> {
        try {
            const rawFileName = `${guidResolverResponse.type}--`
                              + `${guidResolverResponse.guid}--`
                              + `${guidResolverResponse.displayName}`
                              + `${fileNameSuffix ? `--${fileNameSuffix}` : ''}`
                              + `.json`;

            const fileName = rawFileName.replace(/[^a-zA-Z0-9.\-]/g, '_');

            const { uri , error } = await this.getTempFileUri(guidResolverResponse, fileName);

            if(uri === undefined || error) {
                return { error: new Error(`Could not create URI for '${guidResolverResponse.guid}'. Error: ${error?.message}`) };
            }

            const fileContent = Buffer.from(JSON.stringify(
                    {
                        link: this.getLink(guidResolverResponse) || null,
                        date: guidResolverResponse.dateTime,
                        ...guidResolverResponse.object
                    },
                    null,
                    2
                ), 'utf8');

            // this creates missing directories if they do not exist
            await workspace.fs.writeFile(uri, fileContent);

            return { filePath: uri.fsPath };
        }
        catch (e: any) {
            return { error: e };
        }
    }
}
