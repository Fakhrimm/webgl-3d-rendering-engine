import { Node } from "./node";

export class Scene extends Node {
    constructor() {
        super()
        this.parent = null
    }

    public static createSceneDummy(): Scene {
        const scene = new Scene()

        
        const node1 = new Node()
        const node2 = new Node()
        const node3 = new Node()

        node1.setParent(scene)
        node2.setParent(scene)
        node3.setParent(node1)
        return scene
    }
}