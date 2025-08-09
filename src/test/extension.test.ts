import * as assert from 'assert';
import { window } from 'vscode';
import * as fs from 'fs';
import { EntityInfo } from '@azure/arm-managementgroups';
import { AzureManagementGroups } from '../AzureManagementGroups';

suite('Extension Test Suite', () => {
    window.showInformationMessage('Start all tests.');

    const _0     = "_0";

    const _0_1   = "_0_1";
    const _0_1_a = "_0_1_a";
    const _0_1_b = "_0_1_b";

    const _0_2   = "_0_2";
    const _0_2_a = "_0_2_a";
    const _0_2_b = "_0_2_b";

    test('Sample test', () => {
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
});
