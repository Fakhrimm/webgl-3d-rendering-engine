import { Mesh } from "../Object/mesh";
import { Node } from "../Object/node";
import { Scene } from "../Object/scene";
import { FileManager } from "./file-manager";
import { IMesh, IModel, INode } from "./model-interface";


export class SaveLoader {
  static async saveModel(model: Scene, fileName: string) {
    const raw = this.modelToRaw(model);
    const json = JSON.stringify(raw, null, 2);
    await FileManager.writeFile(fileName, json);
  }

  static async loadModel() {
    // const json = await FileManager.readFile();
    // return this.jsonToModel(json);
  }

  static modelToRaw(model: Scene): IModel {
    let [rawNodes, _, rawMeshes] = this.nodeToRaw(model, 0);
    var raw: IModel = {nodes: rawNodes, meshes: rawMeshes};

    return raw;
  }

  static meshToRaw(mesh: Mesh): IMesh {
    let rawMesh: IMesh = {
      geometry: mesh.geometry.toRaw(),
      material: mesh.material.toRaw(),
      animation: {name: "", frames: []}
    };

    return rawMesh;
  }

  static nodeToRaw(node: Node, currIndex: number): [INode[], number, IMesh[]] {
    let rawNodes: INode[] = [];
    let rawMeshes: IMesh[] = [];
    let rawNode = node.toRaw();
    rawNodes.push(rawNode);

    if (node.name.match(/^Mesh/i)) {
      rawMeshes.push(this.meshToRaw(node as Mesh));
    }

    node.getChildren().forEach((child) => {
      currIndex++;
      rawNode.children.push(currIndex);
      let rawChildNodes: INode[];
      let rawChildMeshes: IMesh[];
      [rawChildNodes, currIndex, rawChildMeshes] = this.nodeToRaw(child, currIndex);
      rawNodes = rawNodes.concat(rawChildNodes);
      rawMeshes = rawMeshes.concat(rawChildMeshes);
    });

    return [rawNodes, currIndex, rawMeshes];
  }
}