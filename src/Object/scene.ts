import {Node} from "./node";
import {OrthographicCamera} from "../Camera/orthographicCamera.ts";
import {Mesh} from "./mesh.ts";
import {Material} from "../Material/material.ts";
import {BoxGeometry} from "../Geometry/boxGeometry.ts";

export class Scene extends Node {
    constructor() {
        super();
        this.parent = null;
    }

    public static createSceneDummy(
        canvas: HTMLCanvasElement | null
    ): Scene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new Scene();
        scene.name = "SceneDummy";

        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            -canvas.height / 2,
            canvas.height / 2,
            -101,
            101
        );

        let mesh = new Mesh(new BoxGeometry(50, 50, 50), new Material());
        mesh.name = "Mesh";

        let mesh2 = new Mesh(new BoxGeometry(200, 50, 1), new Material());
        mesh2.name = "Mesh2";

        orthographicCamera.setParent(scene);
        mesh.setParent(scene);
        // mesh2.setParent(scene);

        return scene;
    }
}
