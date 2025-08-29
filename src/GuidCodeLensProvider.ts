import { CancellationToken, CodeLens, CodeLensProvider, Command, Range, TextDocument } from 'vscode'                        ;
import { GuidCache                                                                   } from './GuidCache'                   ;
import { GuidResolverResponseRenderer                                                } from "./GuidResolverResponseRenderer";
import { GuidResolverResponse                                                        } from './Models/GuidResolverResponse' ;

export class GuidCodeLensProvider implements CodeLensProvider {

    private readonly guidRegex                     = /(?<!\/)([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g           ;
    private readonly guidRegexAzureSubscription    = /subscriptions\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g   ;
    private readonly guidRegexAzureManagementGroup = /managementGroups\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;

    constructor(
        readonly guidCache: GuidCache,
        readonly renderer: GuidResolverResponseRenderer
    ) { }

    provideCodeLenses(document: TextDocument): GuidCodeLens[] {
        console.log('provideCodeLenses ' + new Date().toISOString());

        const codeLenses : GuidCodeLens[] = [];
        const unresolvedGuids                      = new Set<string>();
        const unresolvedGuidsAzureSubscription     = new Set<string>();
        const unresolvedGuidsAzureManagementGroups = new Set<string>();

        const text = document.getText();

        // process guidRegex
        while (true) {
            const match = this.guidRegex.exec(text);

            if (!match) { break; }

            const guid = match[0];

            if(guid === GuidResolverResponse.EMPTY_GUID) {
                continue;
            }

            const response = this.guidCache.getResolved(guid);

            if (response) {
                if (response.type === 'Not Found') {
                    continue;
                }

                if (response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        ),
                        {
                            title: this.renderer.render(response) || '',
                            command: 'ohmyguid.openLink',
                            arguments: [response]
                        }
                    )
                );
            }
            else{
                //this.guidCache.enqueuePromise(guid);
                unresolvedGuids.add(guid);

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        )
                    )
                );
            }
        }

        if (unresolvedGuids.size > 0) {
            this.guidCache.enqueueBatchResolve(Array.from(unresolvedGuids));
        }

        // process guidRegexAzureSubscription
        while (true) {
            const match = this.guidRegexAzureSubscription.exec(text);

            if (!match) { break; }

            const guid = match[0].split('/').at(1);

            if(!guid) {
                continue;
            }

            if(guid === GuidResolverResponse.EMPTY_GUID) {
                continue;
            }

            const response = this.guidCache.getResolved(guid);

            if (response) {
                if (response.type === 'Not Found') {
                    continue;
                }

                if (response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        ),
                        {
                            title: this.renderer.render(response) || '',
                            command: 'ohmyguid.openLink',
                            arguments: [response]
                        }
                    )
                );
            }
            else{
                unresolvedGuidsAzureSubscription.add(guid);

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        )
                    )
                );
            }
        }

        if (unresolvedGuidsAzureSubscription.size > 0) {
            const guids = Array.from(unresolvedGuidsAzureSubscription);

            for (const guid of guids) {
                this.guidCache.enqueuePromiseAzureSubscription(guid);
            }
        }

        // process guidRegexAzureManagementGroup
        while (true) {
            const match = this.guidRegexAzureManagementGroup.exec(text);

            if (!match) { break; }

            const guid = match[0].split('/').at(1);

            if(!guid) {
                continue;
            }

            if(guid === GuidResolverResponse.EMPTY_GUID) {
                continue;
            }

            const response = this.guidCache.getResolved(guid);

            if (response) {
                if (response.type === 'Not Found') {
                    continue;
                }

                if (response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        ),
                        {
                            title: this.renderer.render(response) || '',
                            command: 'ohmyguid.openLink',
                            arguments: [response]
                        }
                    )
                );
            }
            else{
                unresolvedGuidsAzureManagementGroups.add(guid);

                codeLenses.push(
                    new GuidCodeLens(
                        guid,
                        new Range(
                            document.positionAt(match.index),
                            document.positionAt(match.index + guid.length)
                        )
                    )
                );
            }
        }

        if (unresolvedGuidsAzureManagementGroups.size > 0) {
            const guids = Array.from(unresolvedGuidsAzureManagementGroups);

            for (const guid of guids) {
                this.guidCache.enqueuePromiseAzureManagementGroup(guid);
            }
        }

        return codeLenses;
    }

    async resolveCodeLens(codeLens: GuidCodeLens, token: CancellationToken) : Promise<GuidCodeLens> {
        console.log('resolveCodeLens ' + codeLens.guid);

        const promise = this.guidCache.getResolvedOrResolvePromise(codeLens.guid);
        if (promise) {
            const resolvedValue = await promise;

            if (resolvedValue && resolvedValue.type === 'Not Found') {
                codeLens.command = {
                    title: '',
                    command: '',
                    arguments: []
                };

                return codeLens;
            }

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
