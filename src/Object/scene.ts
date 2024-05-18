import {Node} from "./node";
import {Mesh} from "./mesh.ts";
import {BoxGeometry} from "../Geometry/boxGeometry.ts";
import {BasicMaterial} from "../Material/basic-material.ts";
import {Color} from "../Math/color.ts";
import {PhongMaterial} from "../Material/phong-material.ts";
import {OrthographicCamera} from "../Camera/orthographic-camera.ts";
import {Camera} from "../Camera/camera.ts";
import {ObliqueCamera} from "../Camera/oblique-camera.ts";
import {PerspectiveCamera} from "../Camera/perspective-camera.ts";

export class Scene extends Node {
    activeCamera: Camera | null = null;

    constructor() {
        super();
        this.parent = null;
    }

    public getActiveCamera(): Camera | null {
        return this.activeCamera;
    }

    setActiveCamera(
        cameraType: new (...args: any[]) => Camera
    ): void {
        let foundCamera: Camera | null = null;
        this.traverseWithTotalBreak((node) => {
            if (node instanceof cameraType) {
                foundCamera = node as Camera;
                return false; // Found the camera, stop traversal
            }
            return true; // Continue traversal otherwise
        });
        if (!foundCamera) {
            console.warn("No camera of type", cameraType, "found in the scene");
            return;
        }
        this.activeCamera = foundCamera;
    }

    setActiveCameraToDefault(): void {
        if (this.activeCamera) {
            this.activeCamera.toDefault();
        }
    }

    setActiveCameraZoom(zoom: number): void {
        if (this.activeCamera) {
            this.activeCamera.setZoom(zoom);
        }
    }

    public static createSceneDummy(
        canvas: HTMLCanvasElement | null
    ): Scene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new Scene();
        scene.name = "SceneDummy";

        let material1 = new BasicMaterial();
        let material2 = new PhongMaterial(Color.RED);

        let mesh = new Mesh(new BoxGeometry(50, 50, 50, true), material1);
        mesh.name = "Mesh";

        let mesh2 = new Mesh(new BoxGeometry(200, 100, 100, false), material2);
        mesh2.name = "Mesh2";

        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            100,
            -1000
        );
        orthographicCamera.name = "OrthoCamera";

        const obliqueCamera = new ObliqueCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            100,
            -1000
        );
        obliqueCamera.name = "ObliqueCamera";

        const perspectiveCamera = new PerspectiveCamera(
            60,
            canvas.width / canvas.height,
            50,
            -1000
        );
        perspectiveCamera.name = "PerspectiveCamera";
        perspectiveCamera.setPosition(0, 0, 400);

        mesh2.setPosition(0, 0, -200);



        orthographicCamera.setParent(scene);
        obliqueCamera.setParent(scene);
        perspectiveCamera.setParent(scene);
        mesh.setParent(scene);
        mesh2.setParent(scene);

        scene.setActiveCamera(PerspectiveCamera);
        return scene;
    }
}
