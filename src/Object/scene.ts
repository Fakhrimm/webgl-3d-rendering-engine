import { Node } from "./node";
import {OrthographicCamera} from "../Camera/orthographicCamera.ts";
import {Mesh} from "./mesh.ts";
import {Material} from "../Material/material.ts";
import {BoxGeometry} from "../Geometry/boxGeometry.ts";
import {Vector3} from "../Math/vector-3.ts";

export class Scene extends Node {
    constructor() {
        super()
        this.parent = null
    }

    public static createSceneDummy(canvas: HTMLCanvasElement | null, now: number): Scene {
        if (!canvas) {
            throw new Error("Canvas is null")
        }
        const scene = new Scene()
        scene.name = "SceneDummy"

        const ortoCamera = new OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -101, 101)
        ortoCamera.name = "OrthographicCamera"

        // const plane = new PlaneGeometry(100, 100)
        // const mesh = new Mesh(plane, new Material())

        const mesh = new Mesh(new BoxGeometry(100, 100, 100), new Material())
        mesh.name = "Mesh"

        mesh.setRotationFromAxisAngle(new Vector3(0.57735026919, 0.57735026919, 0.57735026919), now)

        ortoCamera.setParent(scene)
        mesh.setParent(scene)

        return scene
    }
}