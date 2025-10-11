import { CancellationToken, CodeLens, CodeLensProvider, Command, Position, Range, TextDocument } from 'vscode'                        ;
import { GuidCache                                                                             } from './GuidCache'                   ;
import { GuidResolverResponseRenderer                                                          } from "./GuidResolverResponseRenderer";
import { GuidResolverResponse                                                                  } from './Models/GuidResolverResponse' ;

export class GuidCodeLensProvider implements CodeLensProvider {
    constructor(
        private readonly guidCache: GuidCache,
        private readonly renderer: GuidResolverResponseRenderer,
        private readonly options: {
            enableCodelensesForGuids                   : boolean,
            enableCodelensesForAzureSubscriptionIds    : boolean,
            enableCodelensesForAzureManagementGroupIds : boolean
        } = {
            enableCodelensesForGuids                   : true,
            enableCodelensesForAzureSubscriptionIds    : true,
            enableCodelensesForAzureManagementGroupIds : true
        }
    ) { }

    provideCodeLenses(document: TextDocument): GuidCodeLens[] {
        console.log('provideCodeLenses ' + new Date().toISOString());

        const codeLenses : GuidCodeLens[] = [];

        const text = document.getText();

        if(this.options.enableCodelensesForGuids)
        {
            const regex = /(?<!\/)([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;
            const unresolvedGuids = new Set<string>();
            while (true) {
                const match = regex.exec(text);

                if (!match) { break; }

                const guid = match[0];

                const response = this.guidCache.getResolved(guid);

                if (!response) {
                    unresolvedGuids.add(guid);
                }
                else if (response.type === 'Not Found' || response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(this.getGuidCodeLens(guid, document.positionAt(match.index), response));
            }

            if (unresolvedGuids.size > 0) {
                this.guidCache.enqueueBatchResolve(Array.from(unresolvedGuids));
            }
        }

        if(this.options.enableCodelensesForAzureSubscriptionIds)
        {
            const regex = /subscriptions\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(?!\/)/g;
            const unresolvedGuidsAzureSubscription = new Set<string>();
            while (true) {
                const match = regex.exec(text);

                if (!match) { break; }

                const guid = match[1];

                if (!guid) { continue; }

                const response = this.guidCache.getResolved(guid);

                if (!response) {
                    unresolvedGuidsAzureSubscription.add(guid);
                }
                else if (response.type === 'Not Found' || response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(this.getGuidCodeLens(guid, document.positionAt(match.index), response));
            }

            if (unresolvedGuidsAzureSubscription.size > 0) {
                this.guidCache.enqueueBatchResolve(Array.from(unresolvedGuidsAzureSubscription), 'Azure Subscription');
            }
        }

        if(this.options.enableCodelensesForAzureManagementGroupIds)
        {
            const regex = /managementGroups\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/g;

            const unresolvedGuidsAzureManagementGroups = new Set<string>();
            while (true) {
                const match = regex.exec(text);

                if (!match) { break; }

                const guid = match[1];

                if (!guid) { continue; }

                const response = this.guidCache.getResolved(guid);

                if (!response) {
                    unresolvedGuidsAzureManagementGroups.add(guid);
                }
                else if (response.type === 'Not Found' || response.type === 'Empty') {
                    continue;
                }

                codeLenses.push(this.getGuidCodeLens(guid, document.positionAt(match.index), response));
            }

            if (unresolvedGuidsAzureManagementGroups.size > 0) {
                this.guidCache.enqueueBatchResolve(Array.from(unresolvedGuidsAzureManagementGroups), 'Azure ManagementGroup');
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

    private getGuidCodeLens(
        guid: string,
        start: Position,
        response?: GuidResolverResponse
    ): GuidCodeLens {
        return new GuidCodeLens(
            guid,
            new Range(start, start.translate(0, guid.length)),
            response ? undefined :
            {
                title     : this.renderer.render(response),
                command   : 'ohmyguid.openLink',
                arguments : [response]
            }
        );
    }
}

class GuidCodeLens extends CodeLens {
    guid: string;

    constructor(guid: string, range: Range, command?: Command) {
        super(range, command);
        this.guid = guid;
    }
}
