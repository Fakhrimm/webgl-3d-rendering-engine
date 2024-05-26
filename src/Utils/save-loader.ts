import {Mesh} from "../Object/mesh";
import {Node} from "../Object/node";
import {Scene} from "../Object/scene";
import {FileManager} from "./file-manager";
import {IMesh, IModel, INode} from "./model-interface";

export class SaveLoader {
    static async saveModel(model: Scene, fileName: string) {
        const raw = this.modelToRaw(model);
        const json = JSON.stringify(raw, null, 2);
        await FileManager.writeFile(fileName, json);
    }
    static modelToRaw(model: Scene): IModel {
        let [rawNodes, _, rawMeshes] = this.nodeToRaw(model, 0,0);
        return {nodes: rawNodes, meshes: rawMeshes};
    }

    static meshToRaw(mesh: Mesh): IMesh {
        return {
            geometry: mesh.geometry.toRaw(),
            material: mesh.material.toRaw(),
            animation: {name: "", frames: []},
        };
    }

    static nodeToRaw(
        node: Node,
        currIndex: number,
        meshIndex: number,
    ): [INode[], number, IMesh[], number] {
        let rawNodes: INode[] = [];
        let rawMeshes: IMesh[] = [];
        let rawNode: INode
        if (node instanceof Mesh) {
            rawNode = node.toRaw();
            rawNode.mesh = meshIndex;
            rawMeshes.push(this.meshToRaw(node));
            meshIndex++;
        } else {
            rawNode = node.toRaw();
        }
        rawNodes.push(rawNode);


        node.getChildren().forEach((child) => {
            currIndex++;
            rawNode.children.push(currIndex);
            let rawChildNodes: INode[];
            let rawChildMeshes: IMesh[];
            [rawChildNodes, currIndex, rawChildMeshes, meshIndex] = this.nodeToRaw(
                child,
                currIndex,
                meshIndex
            );
            rawNodes = rawNodes.concat(rawChildNodes);
            rawMeshes = rawMeshes.concat(rawChildMeshes);
        });

        return [rawNodes, currIndex, rawMeshes, meshIndex];
    }
}
