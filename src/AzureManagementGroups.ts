import { EntityInfo } from "@azure/arm-managementgroups";

export class EntityNode {
    readonly id: string;
    private readonly descendants: EntityNode[];

    constructor(
        readonly entity: EntityInfo,
    ) {
        if (!entity.id) {
            throw new Error('Entity ID is missing');
        }
        this.id = entity.id;
        this.descendants = [];
    }

    addDescendant(child: EntityNode): void {
        this.descendants.push(child);
    }

    getDescendants() {
        return this.descendants;
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

    private resolveDescendantsInternal(entityNode: EntityNode, entityInfos: EntityInfo[]){
        const descendants = entityInfos.filter(p => p.parent?.id === entityNode.id);

        for (const descendant of descendants) {
            const descendantNode = new EntityNode(descendant);

            this.resolveDescendantsInternal(descendantNode, entityInfos);

            entityNode.addDescendant(descendantNode);
        }
    }
}
