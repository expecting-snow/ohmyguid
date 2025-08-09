import { EntityInfo } from "@azure/arm-managementgroups";

export class EntityNode {
    readonly children: EntityNode[];
    constructor(
        readonly entity: EntityInfo,
    ) {
        this.children = [];
    }
}

export class AzureManagementGroups {
    resolveRoot(collection: EntityInfo[]): EntityNode | undefined {
        const entityInfo = collection.find(p => p.parent?.id === undefined);

        if (!entityInfo) {
            return undefined;
        }

        const rootNode = new EntityNode(entityInfo);

        this.resolveDescendantsInternal(rootNode, collection);

        return rootNode;
    }

    private resolveDescendantsInternal(entityNode: EntityNode, collection: EntityInfo[]){
        const descendants = collection.filter(p => p.parent?.id === entityNode.entity.id);

        for (const descendant of descendants) {
            const descendantNode = new EntityNode(descendant);

            this.resolveDescendantsInternal(descendantNode, collection);

            entityNode.children.push(descendantNode);
        }
    }
}
