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
import { RingsHollow } from "../Geometry/ringsHollow.ts";
import { DetailedBoxGeometry } from "../Geometry/detailed-box-geometry.ts";
import { RingGeometry } from "../Geometry/ringGeometry.ts";

export class AustinScene extends Scene {
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

    public static createSceneDummy(
        canvas: HTMLCanvasElement | null
    ): AustinScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new AustinScene();
        scene.name = "CreeperScene";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

        let material1 = new PhongMaterial();

        let ring = new Mesh(new RingGeometry(), material1);
        ring.name = "MetalRing";
        ring.setRotationX(-0.895353906273091);
        ring.setRotationY(-2.874557278034661);
        ring.setRotationZ(-6.408849013323179);

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

        ring.setPosition(0, 50, 300);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        ring.setParent(scene);

        scene.setActiveCamera(OrthographicCamera);
        return scene;
    }
}
