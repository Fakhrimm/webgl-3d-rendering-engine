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
        scene.name = "SpiderScene";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

        let material1 = new PhongMaterial(Color.BLACK);
        material1.setNormalTextureType(3);
        let material2 = new PhongMaterial(Color.BLACK);
        let material3 = new PhongMaterial(Color.SLIMEGRAY);
        let materialAngkle = new PhongMaterial(Color.BLACK);
        let materialEye = new BasicMaterial(Color.WHITE);

        let head = new Mesh(new BoxGeometry(100, 100, 100, true), material1);
        head.name = "head";

        let body = new Mesh(new BoxGeometry(90, 90, 100, false), material3);
        body.name = "body";

        let tail = new Mesh(new BoxGeometry(110, 110, 130, true), material1);
        tail.name = "tail";

        // Angkle
        //right
        let rightAngkleFront = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        rightAngkleFront.name = "rightAngkleFront";
        let rightAngkleFront2 = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        rightAngkleFront2.name = "rightAngkleFront2";
        let rightAngkleBack = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        rightAngkleBack.name = "rightAngkleBack";
        let rightAngkleBack2 = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        rightAngkleBack2.name = "rightAngkleBack2";

        //left
        let leftAngkleFront = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        leftAngkleFront.name = "leftAngkleFront";
        let leftAngkleFront2 = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        leftAngkleFront2.name = "leftAngkleFront2";
        let leftAngkleBack = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        leftAngkleBack.name = "leftAngkleBack";
        let leftAngkleBack2 = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialAngkle
        );
        leftAngkleBack2.name = "leftAngkleBack2";

        // Leg
        //right
        let rightLegFront = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        rightLegFront.name = "rightLegFront";
        let rightLegBack = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        rightLegBack.name = "rightLegBack";
        let rightLegFront2 = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        rightLegFront2.name = "rightLegFront2";
        let rightLegBack2 = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        rightLegBack2.name = "rightLegBack2";

        //left
        let leftLegFront = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        leftLegFront.name = "leftLegFront";
        let leftLegBack = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        leftLegBack.name = "leftLegBack";
        let leftLegFront2 = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        leftLegFront2.name = "leftLegFront2";
        let leftLegBack2 = new Mesh(
            new BoxGeometry(25, 100, 25, false),
            material3
        );
        leftLegBack2.name = "leftLegBack2";

        // EYE
        let leftEye = new Mesh(new BoxGeometry(20, 20, 20, true), materialEye);
        leftEye.name = "leftEye";
        let rightEye = new Mesh(new BoxGeometry(20, 20, 20, true), materialEye);
        rightEye.name = "rightEye";

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

        head.setPosition(0, 0, -100);
        body.setPosition(0, 0, 0);
        tail.setPosition(0, 0, 100);

        leftEye.setPosition(15, 15, -56);
        rightEye.setPosition(-23, 15, -46);

        // left angkle entity
        leftAngkleFront.setPosition(-50, -10, -50);
        leftAngkleFront2.setPosition(-78, -31, -16);
        leftAngkleBack.setPosition(-50, -10, 0);
        leftAngkleBack2.setPosition(-50, -10, 25);

        leftAngkleFront.setRotationX(0);
        leftAngkleFront2.setRotationX(0);
        leftAngkleBack.setRotationX(-30);
        leftAngkleBack2.setRotationX(0);

        leftAngkleFront.setRotationY(-30);
        leftAngkleFront2.setRotationY(-6);
        leftAngkleBack.setRotationY(-30);
        leftAngkleBack2.setRotationY(-30);

        leftAngkleFront.setRotationZ(0);
        leftAngkleFront2.setRotationZ(8);
        leftAngkleBack.setRotationZ(-20);
        leftAngkleBack2.setRotationZ(-20);

        // right angkle entity
        rightAngkleFront.setPosition(50, -10, -50);
        rightAngkleFront2.setPosition(50, -10, -25);
        rightAngkleBack.setPosition(50, -10, 0);
        rightAngkleBack2.setPosition(50, -10, 25);

        rightAngkleFront.setRotationY(30);
        rightAngkleFront2.setRotationY(20);
        rightAngkleBack.setRotationY(10);
        rightAngkleBack2.setRotationY(0);

        rightAngkleFront.setRotationZ(20);
        rightAngkleFront2.setRotationZ(20);
        rightAngkleBack.setRotationZ(20);
        rightAngkleBack2.setRotationZ(20);

        // Left leg entity
        leftLegFront.setPosition(-16, -23, -3);
        leftLegFront2.setPosition(0, 0, 0);
        leftLegBack.setPosition(8, 0, 0);
        leftLegBack2.setPosition(23, -15, -12);

        leftLegFront.setRotationX(1);
        leftLegFront2.setRotationX(0);
        leftLegBack.setRotationX(0);
        leftLegBack2.setRotationX(-3);

        leftLegFront.setRotationY(0);
        leftLegFront2.setRotationY(0);
        leftLegBack.setRotationY(0);
        leftLegBack2.setRotationY(-1);

        leftLegFront.setRotationZ(0);
        leftLegFront2.setRotationZ(0);
        leftLegBack.setRotationZ(0);
        leftLegBack2.setRotationZ(-4);

        // Right leg entity
        rightLegFront.setPosition(0, 0, 0);
        rightLegFront2.setPosition(0, 0, 0);
        rightLegBack.setPosition(0, 0, 0);
        rightLegBack2.setPosition(0, 0, 0);

        leftLegFront.setRotationX(0);
        leftLegFront2.setRotationX(0);
        leftLegBack.setRotationX(0);
        leftLegBack2.setRotationX(0);

        leftLegFront.setRotationY(0);
        leftLegFront2.setRotationY(0);
        leftLegBack.setRotationY(0);
        leftLegBack2.setRotationY(0);

        leftLegFront.setRotationZ(0);
        leftLegFront2.setRotationZ(0);
        leftLegBack.setRotationZ(0);
        leftLegBack2.setRotationZ(0);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        body.setParent(scene);
        head.setParent(body);
        tail.setParent(body);

        leftEye.setParent(head);
        rightEye.setParent(head);

        leftAngkleBack.setParent(body);
        leftAngkleBack2.setParent(body);
        leftAngkleFront.setParent(body);
        leftAngkleFront2.setParent(body);
        rightAngkleBack.setParent(body);
        rightAngkleBack2.setParent(body);
        rightAngkleFront.setParent(body);
        rightAngkleFront2.setParent(body);

        leftLegBack.setParent(leftAngkleBack);
        leftLegBack2.setParent(leftAngkleBack2);
        leftLegFront.setParent(leftAngkleFront);
        leftLegFront2.setParent(leftAngkleFront2);

        rightLegBack.setParent(rightAngkleBack);
        rightLegBack2.setParent(rightAngkleBack2);
        rightLegFront.setParent(rightAngkleFront);
        rightLegFront2.setParent(rightAngkleFront2);

        scene.setActiveCamera(OrthographicCamera);
        return scene;
    }

    public static createRingScene(
        canvas: HTMLCanvasElement | null
    ): AustinScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new AustinScene();
        scene.name = "SpiderScene";

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
