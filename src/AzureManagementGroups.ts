import { EntityInfo } from "@azure/arm-managementgroups";

export class EntityNode {
    private readonly descendants: EntityNode[];

    constructor(
        readonly entity: EntityInfo,
    ) {
        if (!entity.id) {
            throw new Error('Entity ID is missing');
        }

        this.descendants = [];
    }

    addDescendant(child: EntityNode): void {
        this.descendants.push(child);
    }

    getDescendants() {
        return this.descendants;
    }

    flatten() {
        const flat = this.flattenInternal(this);

        return this.deepCloneExclude(flat, ['entity', 'descendants']);;
    }

    flattenInternal(node: EntityNode): any {
        const descendants = node.getDescendants();

        if (descendants.length > 0) {
            for (const descendant of descendants) {
                (node as any)[`${descendant.entity.displayName}`] = this.flattenInternal(descendant);
            }

            return node;
        }
        else {

            return node.entity.id;
        }
    }

    deepCloneExclude<T extends object>(obj: T, exclude: string[]): T {
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepCloneExclude(item, exclude)) as any;
        } else if (obj && typeof obj === 'object') {
            const result: any = {};
            for (const key of Object.keys(obj)) {
                if (!exclude.includes(key)) {
                    result[key] = this.deepCloneExclude((obj as any)[key], exclude);
                }
            }
            return result;
        }
        return obj;
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
        const descendants = entityInfos.filter(p => p.parent?.id === entityNode.entity.id);

        for (const descendant of descendants) {
            const descendantNode = new EntityNode(descendant);

            this.resolveDescendantsInternal(descendantNode, entityInfos);

            entityNode.addDescendant(descendantNode);
        }
    }
}
