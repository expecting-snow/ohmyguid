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
}

export class EntityNodeTransform {
    resolve(node: EntityNode) {
        const response: any =  {};
        
        response.displayName =  node.entity.displayName;
        response.id =  node.entity.id;
        response.descendants = node.getDescendants().map(descendant => this.resolve(descendant));


        // const descendants = node.getDescendants();
        
        // for (const descendant of descendants) {
        //     response.descendants.push( this.resolve(descendant));
        // }

        return response;
    }

     resolveInt(node: EntityNode, response:any) {

        response[`${node.entity.displayName}`] = {};

        const descendants = node.getDescendants();
        
        for (const descendant of descendants) {
           response[`${node.entity.displayName}`][`${descendant.entity.displayName}`] = this.resolve(descendant);
        }

        return response;
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
