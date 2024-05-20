import { Node } from "../Object/node";
import { Scene } from "../Object/scene";
import { FileManager } from "./file-manager";
import { INode, INodes } from "./model-interface";


export class SaveLoader {
  static async saveModel(model: Scene, fileName: string) {
    const json = JSON.stringify(this.modelToJSON(model));
    await FileManager.writeFile(fileName, json);
  }

  static async loadModel(
  ) {
  }

  static modelToJSON(model: Scene): INodes {
    let [rawNodes, _] = this.nodeToRaw(model, 0);
    var json: INodes = {nodes: rawNodes};

    return json;
  }

  static nodeToRaw(node: Node, currIndex: number): [INode[], number] {
    let rawNodes: INode[] = [];
    let rawNode = node.toRaw();
    console.log(`Raw node: `);
    console.log(rawNode);
    rawNodes.push(rawNode);

    node.getChildren().forEach((child) => {
      currIndex++;
      rawNode.children.push(currIndex);
      let rawChildNodes: INode[];
      [rawChildNodes, currIndex] = this.nodeToRaw(child, currIndex);
      console.log(`Raw child nodes: `);
      console.log(rawChildNodes);
      rawNodes = rawNodes.concat(rawChildNodes);
      console.log(`Raw nodes after: `);
      console.log(rawNodes); 
    });

    return [rawNodes, currIndex];
  }
}