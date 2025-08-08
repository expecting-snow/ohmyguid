import { AbortController as AzureAbortController                 } from "@azure/abort-controller"                                                               ;
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
import { Uri, workspace                                          } from 'vscode'                                                                                ;
import * as os                                                     from 'os'                                                                                    ;
import * as path                                                   from 'path'                                                                                  ;

export class GuidResolverResponseToTempFile {

    constructor(
        private readonly onResponse    : (guidResolverResponse: GuidResolverResponse) => void,
        private readonly onToBeResolved: (guid                : string              ) => void,
        private readonly getLink       : (item                : GuidResolverResponse) => string | undefined,
        private readonly callbackError : (error               : string              ) => void,
        private readonly pathSubDirectories = ['expecting-snow', 'ohmyguid']
    ) { }

    /**
    * Resolves details for a given {@link GuidResolverResponse} on demand and persists them to a temporary file.
    *
    * @param guidResolverResponse - {@link GuidResolverResponse}
    * @param fileNameSuffix       - '' or 'details'. 'details' triggers the resolution of additional details for certain response types.
    * @param tokenCredential      - {@link TokenCredential}
    * 
    * @returns - If the {@link GuidResolverResponse.type} is not supported, it will return the original {@link GuidResolverResponse}, otherwise the detailed {@link GuidResolverResponse}.
    */
    async toTempFile(guidResolverResponse: GuidResolverResponse, resolutionType: '' | 'details', tokenCredential: TokenCredential): Promise<{ guidResolverResponse: GuidResolverResponse, filePath?: string, error?: Error }>{
        if(resolutionType === '') {
            return this.toTempFileInternal(guidResolverResponse);
        }
        
        const responseType         = guidResolverResponse.type;
        const guid                 = guidResolverResponse.guid;
        const abortController      = new AbortController();
        const azureAbortController = new AzureAbortController();

        abortController.signal.addEventListener('abort', () => azureAbortController.abort());

        switch (responseType) {
            case 'Azure Advisor Recommendation'       : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                                );
            case 'Azure Policy Definition BuiltIn'    : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                                );
            case 'Azure Policy Definition Custom'     : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                                );
            case 'Azure Policy Definition Static'     : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                                );
            case 'Azure RoleDefinition BuiltInRole'   : return this.toTempFileInternal(guidResolverResponse                                                                                                                                                                );
            case 'Azure ManagementGroup'              : return this.toTempFileInternal(await new GuidResolverAzureManagementGroup                       (                                      tokenCredential).resolve(guid, azureAbortController) ?? guidResolverResponse);
            case 'Azure RoleDefinition CustomRole'    : return this.toTempFileInternal(await new GuidResolverAzureRoleDefinitionCustomRoles             (                                      tokenCredential).resolve(guid, azureAbortController) ?? guidResolverResponse);
            case 'Azure Subscription'                 : return this.toTempFileInternal(await new GuidResolverAzureSubscription                          (                                      tokenCredential).resolve(guid, azureAbortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID AppRegistration' : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdAppRegistrationWithDetails (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid,      abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Group'           : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdGroupWithDetails           (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid,      abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID ServicePrincipal': return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdServicePrincipalWithDetails(this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid,      abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Tenant'          : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdTenant                     (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid,      abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID User'            : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdUserWithDetails            (this.onResponse, this.onToBeResolved, tokenCredential).resolve(guid,      abortController) ?? guidResolverResponse);
            default:
                this.callbackError(`ResponseToTempFile: Unknown response type: ${responseType}`);
                return this.toTempFileInternal(guidResolverResponse);
        }
    }

    getTempFileUri(guidResolverResponse: GuidResolverResponse): { uri?: Uri, error?: Error } {
        try {
            const rawFileName = `${guidResolverResponse.type}--`
                              + `${guidResolverResponse.guid}--`
                              + `${guidResolverResponse.displayName}`
                              + `.json`;

            const fileName = rawFileName.replace(/[^a-zA-Z0-9.\-]/g, '_');

            const tempFileUri = Uri.file(path.join(os.tmpdir(), ...this.pathSubDirectories, fileName));

            return { uri: tempFileUri };
        }
        catch (e: any) {
            return { error: e };
        }
    }

    private async toTempFileInternal(guidResolverResponse: GuidResolverResponse): Promise<{ guidResolverResponse: GuidResolverResponse, filePath?: string, error?: Error }> {
        try {
            //throw new Error('This method should not be called directly. Use `toTempFile` instead.');
            const { uri , error } = this.getTempFileUri(guidResolverResponse);

            if(uri === undefined || error) {
                return { guidResolverResponse, error: new Error(`Could not create URI for '${guidResolverResponse.guid}'. Error: ${error?.message}`) };
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

            // missing directories are created automatically
            await workspace.fs.writeFile(uri, fileContent);

            return { guidResolverResponse, filePath: uri.fsPath };
        }
        catch (e: any) {
            return { guidResolverResponse, error: e };
        }
    }
}
