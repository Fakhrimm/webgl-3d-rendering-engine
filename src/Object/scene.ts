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

        let mesh2 = new Mesh(new BoxGeometry(200, 200, 200, false), material1);
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

    public static createSceneDummyDog(canvas: HTMLCanvasElement | null): Scene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new Scene();
        scene.name = "SceneDummyDog";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

        const bodyMaterial = new BasicMaterial();
        const detailMaterial = new PhongMaterial();

        // Body (Horizontal)
        const body = new Mesh(new BoxGeometry(50, 50, 80, true), bodyMaterial);
        body.name = "Body";
        body.setPosition(0, 0, 0);
        body.setParent(originNode);

        // Head
        const head = new Mesh(new BoxGeometry(30, 30, 30, true), bodyMaterial);
        head.name = "Head";
        head.setPosition(0, 0, 50);
        head.setParent(body);

        // Eyes
        const eye1 = new Mesh(new BoxGeometry(5, 5, 5, true), detailMaterial);
        eye1.name = "Eye1";
        eye1.setPosition(-10, 10, 15);
        eye1.setParent(head);

        const eye2 = new Mesh(new BoxGeometry(5, 5, 5, true), detailMaterial);
        eye2.name = "Eye2";
        eye2.setPosition(10, 10, 15);
        eye2.setParent(head);

        // Nose
        const nose = new Mesh(new BoxGeometry(5, 5, 5, true), detailMaterial);
        nose.name = "Nose";
        nose.setPosition(0, 0, 15);
        nose.setParent(head);

        // Legs
        const leg1 = new Mesh(new BoxGeometry(10, 40, 10, true), bodyMaterial);
        leg1.name = "Leg1";
        leg1.setPosition(-30, -25, 15);
        leg1.setParent(body);

        const leg2 = new Mesh(new BoxGeometry(10, 40, 10, true), bodyMaterial);
        leg2.name = "Leg2";
        leg2.setPosition(30, -25, 15);
        leg2.setParent(body);

        const leg3 = new Mesh(new BoxGeometry(10, 40, 10, true), bodyMaterial);
        leg3.name = "Leg3";
        leg3.setPosition(-30, -25, -25);
        leg3.setParent(body);

        const leg4 = new Mesh(new BoxGeometry(10, 40, 10, true), bodyMaterial);
        leg4.name = "Leg4";
        leg4.setPosition(30, -25, -25);
        leg4.setParent(body);

        // Tail
        const tail = new Mesh(new BoxGeometry(5, 30, 5, true), bodyMaterial);
        tail.name = "Tail";
        tail.setPosition(0, -15, -40);
        tail.setParent(body);

        // Ears
        const ear1 = new Mesh(new BoxGeometry(5, 10, 5, true), bodyMaterial);
        ear1.name = "Ear1";
        ear1.setPosition(-10, 15, 10);
        ear1.setParent(head);

        const ear2 = new Mesh(new BoxGeometry(5, 10, 5, true), bodyMaterial);
        ear2.name = "Ear2";
        ear2.setPosition(10, 15, 10);
        ear2.setParent(head);

        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            -500,
            500
        );
        orthographicCamera.name = "OrthoCamera";

        orthographicCamera.setParent(originNode);

        scene.setActiveCamera(OrthographicCamera);
        return scene;
    }
}
