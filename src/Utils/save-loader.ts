import { Scene } from "../Object/scene";
import { FileManager } from "./file-manager";


export class SaveLoader {
  static async saveModel(model: Scene, filePath: string) {
    const json = JSON.stringify(model);
    await FileManager.writeFile(filePath, json);
  }

  static async loadModel(
  ) {
  }
}