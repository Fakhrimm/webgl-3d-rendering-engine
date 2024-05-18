import {Node} from "./node";
import {Mesh} from "./mesh.ts";
import {BoxGeometry} from "../Geometry/boxGeometry.ts";
import {BasicMaterial} from "../Material/basic-material.ts";
import {Color} from "../Math/color.ts";
import {PhongMaterial} from "../Material/phong-material.ts";
import {OrthographicCamera} from "../Camera/orthographicCamera.ts";

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

        const cameraNode = new Node();
        cameraNode.name = "CameraNode";
        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            1000,
            -1000
        );
        orthographicCamera.name = "OrthoCamera";

        let material1 = new BasicMaterial();
        let material2 = new PhongMaterial(Color.RED);

        let mesh = new Mesh(new BoxGeometry(50, 50, 50), material1);
        // let mesh = new Mesh(new BoxGeometry(50, 50, 50, 5, 50), material2);
        mesh.name = "Mesh";

        let mesh2 = new Mesh(new BoxGeometry(100, 100, 100, true), material2);
        mesh2.name = "Mesh2";

        orthographicCamera.setPosition(0, 0, 0);
        mesh2.setPosition(0, 0, 0);



        orthographicCamera.setParent(cameraNode);
        cameraNode.setParent(scene);
        // mesh.setParent(scene);
        mesh2.setParent(scene);

        return scene;
    }
}
