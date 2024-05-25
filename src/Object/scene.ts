import { Node } from "./node";
import { Mesh } from "./mesh.ts";
import { BoxGeometry } from "../Geometry/boxGeometry.ts";
import { BasicMaterial } from "../Material/basic-material.ts";
import { PhongMaterial } from "../Material/phong-material.ts";
import { OrthographicCamera } from "../Camera/orthographic-camera.ts";
import { Camera } from "../Camera/camera.ts";
import { ObliqueCamera } from "../Camera/oblique-camera.ts";
import { PerspectiveCamera } from "../Camera/perspective-camera.ts";
import { RingGeometry } from "../Geometry/ringGeometry.ts";

export class Scene extends Node {
    activeCamera: Camera | null = null;

    constructor() {
        super();
        this.parent = null;
    }

    public getActiveCamera(): Camera | null {
        return this.activeCamera;
    }

    setActiveCamera(cameraType: new (...args: any[]) => Camera): void {
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

    getOriginNode(): Node {
        return this.getChildren()[0];
    }

    public static createSceneDummy(canvas: HTMLCanvasElement | null): Scene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new Scene();
        scene.name = "SceneDummy";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

        let material1 = new BasicMaterial();
        let material2 = new PhongMaterial();

        let mesh = new Mesh(new BoxGeometry(50, 50, 50, true), material1);
        mesh.name = "Mesh";

        let mesh2 = new Mesh(new BoxGeometry(200, 200, 200, false), material2);
        mesh2.name = "Mesh2";

        // let mesh3 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'z+'), material2);
        // mesh3.name = "Mesh3";
        // let mesh4 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'z-'), material2);
        // mesh4.name = "Mesh4";
        // let mesh5 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'x+'), material2);
        // mesh5.name = "Mesh5";
        // let mesh6 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'x-'), material2);
        // mesh6.name = "Mesh6";
        // let mesh7 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'y+'), material2);
        // mesh7.name = "Mesh7";
        // let mesh8 = new Mesh(new PlaneGeometry(200, 200, 200, 1, 1, 'y-'), material2);
        // mesh8.name = "Mesh8";

        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            -500,
            500
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
            70,
            canvas.width / canvas.height,
            0.1,
            1000,
            1
        );
        perspectiveCamera.name = "PerspectiveCamera";
        perspectiveCamera.setPosition(0, 0, 300);

        mesh.setPosition(0, 0, 300);
        // mesh2.setPosition(0, 0, -300);
        // mesh3.setPosition(0, 0, -300);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);
        mesh2.setParent(scene);
        // mesh.setParent(mesh2);

        // const node = new Node();
        // node.name = "Node";
        // node.setParent(scene);

        // mesh3.setParent(node);
        // mesh4.setParent(node);
        // mesh5.setParent(node);
        // mesh6.setParent(node);
        // mesh7.setParent(node);
        // mesh8.setParent(node);

        // const meshRing = new Mesh(new BoxGeometry(), material2);
        // meshRing.name = "Ring";
        // meshRing.setPosition(0, 0, 300);
        // meshRing.setParent(scene);

        scene.setActiveCamera(OrthographicCamera);
        return scene;
    }
}
