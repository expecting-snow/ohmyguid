import { constants, mkdir, writeFile                             } from 'fs/promises'                                                                           ;
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
import * as os   from 'os';
import * as path from 'path';


export class GuidResolverResponseToTempFile {

    constructor(
        private readonly getLink: (item: GuidResolverResponse) => string | undefined,
        private readonly pathSubDirectories = ['expecting-snow', 'ohmyguid']
    ) { }

    async toTempFile(guidResolverResponse: GuidResolverResponse, tokenCredential: TokenCredential): Promise<{ filePath?: string, error?: Error }>{
        const responseType    = guidResolverResponse.type;
        const guid            = guidResolverResponse.guid;
        const abortController = new AbortController();

        switch (responseType) {
            case 'Azure Advisor Recommendation'       : return this.toTempFileInternal(guidResolverResponse);
            case 'Azure ManagementGroup'              : return this.toTempFileInternal(await new GuidResolverAzureManagementGroup                       (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Azure Policy Definition BuiltIn'    : return this.toTempFileInternal(guidResolverResponse);
            case 'Azure Policy Definition Custom'     : return this.toTempFileInternal(guidResolverResponse);
            case 'Azure Policy Definition Static'     : return this.toTempFileInternal(guidResolverResponse);
            case 'Azure RoleDefinition BuiltInRole'   : return this.toTempFileInternal(guidResolverResponse);
            case 'Azure RoleDefinition CustomRole'    : return this.toTempFileInternal(await new GuidResolverAzureRoleDefinitionCustomRoles             (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Azure Subscription'                 : return this.toTempFileInternal(await new GuidResolverAzureSubscription                          (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID AppRegistration' : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdAppRegistrationWithDetails (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Group'           : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdGroupWithDetails           (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID ServicePrincipal': return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdServicePrincipalWithDetails(tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Tenant'          : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdTenant                     (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID User'            : return this.toTempFileInternal(await new GuidResolverMicrosoftEntraIdUserWithDetails            (tokenCredential).resolve(guid, abortController) ?? guidResolverResponse);
            default:                                    return this.toTempFileInternal(guidResolverResponse);
        }
    }

    private async toTempFileInternal(guidResolverResponse: GuidResolverResponse): Promise<{ filePath?: string, error?: Error }> {
        const tempDirectory = os.tmpdir();

        if (!tempDirectory) {
            return { error: new Error('Unable to determine temporary directory') };
        }

        try {
            await mkdir(path.join(tempDirectory, ...this.pathSubDirectories), { recursive: true });

            const fileName = `${guidResolverResponse.type} ${guidResolverResponse.guid}.json`.replaceAll(' ','_');

            const filePath = path.join(tempDirectory, ...this.pathSubDirectories, fileName);

            await writeFile(
                filePath,
                JSON.stringify(
                    {
                        link: this.getLink(guidResolverResponse) || null,
                        date: guidResolverResponse.dateTime,
                        data: guidResolverResponse.object
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
