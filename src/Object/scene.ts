import { Node } from "./node";

export class Scene extends Node {
    constructor() {
        super()
        this.parent = null
    }

    public static createSceneDummy(): Scene {
        const scene = new Scene()
        scene.name = "SceneDummy"
        
        const node1 = new Node()
        node1.name = "Node1"
        const node2 = new Node()
        node2.name = "Node2"
        const node3 = new Node()
        node3.name = "Node3"

        node1.setParent(scene)
        node2.setParent(scene)
        node3.setParent(node1)
        return scene
    }
}