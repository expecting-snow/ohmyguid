import { Client                                       } from '@microsoft/microsoft-graph-client';
import { constants, mkdir, writeFile                  } from 'fs/promises';
import { GuidResolverAzureManagementGroup             } from './GuidResolverAzure/GuidResolverAzureManagementGroup';
import { GuidResolverAzureRoleDefinitionCustomRoles   } from './GuidResolverAzure/GuidResolverAzureRoleDefinitionCustomRoles';
import { GuidResolverAzureSubscription                } from './GuidResolverAzure/GuidResolverAzureSubscription';
import { GuidResolverMicrosoftEntraIdAppRegistration  } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdAppRegistration';
import { GuidResolverMicrosoftEntraIdGroup            } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdGroup';
import { GuidResolverMicrosoftEntraIdServicePrincipal } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdServicePrincipal';
import { GuidResolverMicrosoftEntraIdTenant           } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdTenant';
import { GuidResolverMicrosoftEntraIdUser             } from './GuidResolverMicrosoftEntraId/GuidResolverMicrosoftEntraIdUser';
import { GuidResolverResponse                         } from "./Models/GuidResolverResponse";
import { TokenCredential                              } from '@azure/identity';
import { TokenCredentialAuthenticationProvider        } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
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
            case 'Azure Advisor Recommendation':
                return this.toTempFileInternal(guidResolverResponse);
            case 'Azure ManagementGroup':
                return this.toTempFileInternal(await GuidResolverAzureManagementGroup.resolve(guid, tokenCredential, abortController) ?? guidResolverResponse);
            case 'Azure Policy Definition BuiltIn':
                return this.toTempFileInternal(guidResolverResponse);
            case 'Azure Policy Definition Custom':
                // todo add subscriptionIds
                return this.toTempFileInternal(guidResolverResponse);
            case 'Azure Policy Definition Static':
                return this.toTempFileInternal(guidResolverResponse);
            case 'Azure RoleDefinition BuiltInRole':
                return this.toTempFileInternal(guidResolverResponse);
            case 'Azure RoleDefinition CustomRole':
                 return this.toTempFileInternal(await GuidResolverAzureRoleDefinitionCustomRoles.resolve(guid, tokenCredential, abortController) ?? guidResolverResponse);
            case 'Azure Subscription':
                return this.toTempFileInternal(await GuidResolverAzureSubscription.resolve(guid, tokenCredential, abortController) ?? guidResolverResponse);
            default:
        }

        const client = Client.initWithMiddleware({
            fetchOptions: {
                signal: abortController.signal
            },
            authProvider: new TokenCredentialAuthenticationProvider(
                tokenCredential, {
                    getTokenOptions: {
                        abortSignal: abortController.signal
                    },
                    scopes: [
                        'https://graph.microsoft.com/.default'
                    ]
                }
            )
        });

        switch (responseType) {
            case 'Microsoft Entra ID AppRegistration':
                return this.toTempFileInternal(await GuidResolverMicrosoftEntraIdAppRegistration .resolve(client, guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Group':
                return this.toTempFileInternal(await GuidResolverMicrosoftEntraIdGroup           .resolve(client, guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID ServicePrincipal':
                return this.toTempFileInternal(await GuidResolverMicrosoftEntraIdServicePrincipal.resolve(client, guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID Tenant':
                return this.toTempFileInternal(await GuidResolverMicrosoftEntraIdTenant          .resolve(client, guid, abortController) ?? guidResolverResponse);
            case 'Microsoft Entra ID User':
                return this.toTempFileInternal(await GuidResolverMicrosoftEntraIdUser            .resolve(client, guid, abortController) ?? guidResolverResponse);
            default:
        }

        return this.toTempFileInternal(guidResolverResponse);
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
