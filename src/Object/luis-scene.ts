import { Node } from "./node";
import { Mesh } from "./mesh.ts";
import { BoxGeometry } from "../Geometry/boxGeometry.ts";
import { BasicMaterial } from "../Material/basic-material.ts";
import { PhongMaterial } from "../Material/phong-material.ts";
import { OrthographicCamera } from "../Camera/orthographic-camera.ts";
import { Camera } from "../Camera/camera.ts";
import { ObliqueCamera } from "../Camera/oblique-camera.ts";
import { PerspectiveCamera } from "../Camera/perspective-camera.ts";
import { Scene } from "./scene.ts";
import { Color } from "../Math/color.ts";

export class LuisScene extends Scene {
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

    public static createSceneDummy(canvas: HTMLCanvasElement | null): LuisScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new LuisScene();
        scene.name = "CreeperScene";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

        let material1 = new PhongMaterial();
        let material2 = new BasicMaterial(Color.BLACK);
        let material3 = new BasicMaterial(Color.DARKGREEN);

        let head = new Mesh(new BoxGeometry(90, 90, 90, true), material1);
        head.name = "head";

        let body = new Mesh(new BoxGeometry(75, 170, 75, false), material3);
        body.name = "body";

        let leftLegFront = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        leftLegFront.name = "leftLegFront";

        let leftLegBack = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        leftLegBack.name = "leftLegBack";
        
        let rightLegFront = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        rightLegFront.name = "rightLegFront";

        let rightLegBack = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        rightLegBack.name = "rightLegBack";

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

        head.setPosition(0, 130, 0);
        body.setPosition(0, 50, 300);
        leftLegFront.setPosition(50, -105, -25);
        rightLegFront.setPosition(50, -105, 25);
        leftLegBack.setPosition(-50, -105, -25);
        rightLegBack.setPosition(-50, -105, 25);


        // mesh3.setPosition(0, 0, -300);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        body.setParent(scene);
        head.setParent(body);
        leftLegFront.setParent(body);
        rightLegFront.setParent(body);
        leftLegBack.setParent(body);
        rightLegBack.setParent(body);





        
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
