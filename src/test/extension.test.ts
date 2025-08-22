import { AzureManagementGroups        } from '../AzureManagementGroups'       ;
import { CachingAzureCliCredential    } from '../CachingAzureCliCredential'   ;
import { EntityInfo                   } from '@azure/arm-managementgroups'    ;
import { GuidCache                    } from '../GuidCache'                   ;
import { GuidCodeLensProvider         } from '../GuidCodeLensProvider'        ;
import { GuidResolver                 } from '../GuidResolver'                ;
import { GuidResolverResponseRenderer } from '../GuidResolverResponseRenderer';
import { InMemoryMemento              } from './InMemoryMemento'              ;
import { window, workspace            } from 'vscode'                         ;
import * as assert                      from 'assert'                         ;
import { GuidResolverResponse } from '../Models/GuidResolverResponse';

suite('Extension Test Suite', () => {
    window.showInformationMessage('Start all tests.');

    test('AzureManagementGroups', () => {
        const _0     = "_0";
    
        const _0_1   = "_0_1";
        const _0_1_a = "_0_1_a";
        const _0_1_b = "_0_1_b";
    
        const _0_2   = "_0_2";
        const _0_2_a = "_0_2_a";
        const _0_2_b = "_0_2_b";

        const collection: EntityInfo[] = [
            { "id": _0    , "parent": {            }, },
            { "id": _0_1  , "parent": { "id": _0   }, },
            { "id": _0_2  , "parent": { "id": _0   }, },
            { "id": _0_1_a, "parent": { "id": _0_1 }, },
            { "id": _0_1_b, "parent": { "id": _0_1 }, },
            { "id": _0_2_a, "parent": { "id": _0_2 }, },
            { "id": _0_2_b, "parent": { "id": _0_2 }, },
        ];

        const azureManagementGroups = new AzureManagementGroups();
        const root = azureManagementGroups.resolveRoot(collection);

        assert.ok(root?.entity.id === _0);

        assert.ok(root?.getDescendants().find(p => p.entity.id === _0_1));
        assert.ok(root?.getDescendants().find(p => p.entity.id === _0_2));

        assert.ok(root?.getDescendants().filter(p => p.entity.id === _0_1).at(0)?.getDescendants().find(p => p.entity.id === _0_1_a));
        assert.ok(root?.getDescendants().filter(p => p.entity.id === _0_1).at(0)?.getDescendants().find(p => p.entity.id === _0_1_b));

        assert.ok(root?.getDescendants().filter(p => p.entity.id === _0_2).at(0)?.getDescendants().find(p => p.entity.id === _0_2_a));
        assert.ok(root?.getDescendants().filter(p => p.entity.id === _0_2).at(0)?.getDescendants().find(p => p.entity.id === _0_2_b));
    });

    test('GuidCodeLensProvider', async () => {
        const cache = new InMemoryMemento();

        const guidCodeLensProvider = new GuidCodeLensProvider(
            new GuidCache(
                new GuidResolver(
                    _ => { },
                    _ => { },
                    _ => { },
                    new CachingAzureCliCredential(
                        _ => { },
                        _ => { }
                    ),
                    _ => { }
                ),
                new InMemoryMemento(),
                _ => { }
            ),
            new GuidResolverResponseRenderer()
        );

        const data: { input: string, expected: string[] }[] = [
            { 
                input: '', 
                expected: []
            },
            {
                input: '6daad179-3ae7-4b4b-9976-c2b3c5e15ea8',
                expected: [
                    '6daad179-3ae7-4b4b-9976-c2b3c5e15ea8'
                ]
            },
            {
                input: '31b83473-8b22-4436-9ed4-edd276b96001 31b83473-8b22-4436-9ed4-edd276b96001',
                expected: [
                    '31b83473-8b22-4436-9ed4-edd276b96001'
                ]
            },
            {
                input: '319bd7da-77b2-4ff5-bcc4-30cb265e4d42 03eaf1cd-f1f9-446e-9812-128e67691cb3 319bd7da-77b2-4ff5-bcc4-30cb265e4d42',
                expected: [
                    '319bd7da-77b2-4ff5-bcc4-30cb265e4d42',
                    '03eaf1cd-f1f9-446e-9812-128e67691cb3'
                ]
            },
            {
                input: '/subscription/6e93d4c7-9006-4009-934e-64d5f25cf435',
                expected: [
                    '6e93d4c7-9006-4009-934e-64d5f25cf435'
                ]
            },
        ];

   
        for (const datum of data) {
            cache.update(datum.input, new GuidResolverResponse(datum.input, 'test' + datum.input, 'Test', {}, new Date()));
        }

        for (const datum of data) {
            const document = await workspace.openTextDocument({ content: datum.input, language: 'json' });
            const codeLenses = guidCodeLensProvider.provideCodeLenses(document);

            assert.strictEqual(codeLenses.length, datum.expected.length, `Expected ${datum.expected.length} code lenses for input "${datum.input}", but got ${codeLenses.length}`);
            for (let i = 0; i < datum.expected.length; i++) {
                assert.strictEqual(codeLenses[i].guid, datum.expected[i], `Code lens title mismatch for input "${datum.input}" at index ${i}`);
            }
        }
    });
});

