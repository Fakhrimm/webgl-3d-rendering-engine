import { Node } from "./node";
import {OrthographicCamera} from "../Camera/orthographicCamera.ts";
import {Mesh} from "./mesh.ts";
import {PlaneGeometry} from "../Geometry/planeGeometry.ts";
import {Material} from "../Material/material.ts";

export class Scene extends Node {
    constructor() {
        super()
        this.parent = null
    }

    public static createSceneDummy(canvas: HTMLCanvasElement): Scene {
        const scene = new Scene()
        scene.name = "SceneDummy"

        const ortoCamera = new OrthographicCamera(0, canvas.width, canvas.height, 0, -1, 1)
        ortoCamera.name = "OrthographicCamera"

        const plane = new PlaneGeometry(100, 100)
        const mesh = new Mesh(plane, new Material())
        mesh.name = "Mesh"
        // const node2 = new Node()
        // node2.name = "Node2"
        // const node3 = new Node()
        // node3.name = "Node3"

        ortoCamera.setParent(scene)
        mesh.setParent(scene)
        // node2.setParent(scene)
        // node3.setParent(node1)
        return scene
    }
}