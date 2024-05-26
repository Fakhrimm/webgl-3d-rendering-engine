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

        let leftEye = new Mesh(new BoxGeometry(20, 20, 20, true), materialEye);
        leftEye.name = "leftEye";
        let rightEye = new Mesh(new BoxGeometry(20, 20, 20, true), materialEye);
        rightEye.name = "rightEye";

    const perspectiveCamera = new PerspectiveCamera(
        60,
        canvas.width / canvas.height,
        0.1,
        20000,
        1)
    perspectiveCamera.name = "PerspectiveCamera"
    perspectiveCamera.setParent(originNode)

    const orthographicCamera = new OrthographicCamera(
        -canvas.width / 2,
        canvas.width / 2,
        canvas.height / 2,
        -canvas.height / 2,
        -1000,
        +1000
    )
    orthographicCamera.name = "OrthoCamera"
    orthographicCamera.setParent(originNode)

    const obliqueCamera = new ObliqueCamera(
        -canvas.width / 2,
        canvas.width / 2,
        canvas.height / 2,
        -canvas.height / 2,
        -1000,
        +1000
    )
    obliqueCamera.name = "ObliqueCamera"
    obliqueCamera.setParent(originNode)

        head.setPosition(0, 0, -100);
        body.setPosition(0, 0, 0);
        body.setRotationY(135);
        tail.setPosition(0, 0, 100);

        leftEye.setPosition(15, 15, -56);
        rightEye.setPosition(-23, 15, -46);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        body.setParent(scene);
        head.setParent(body);
        tail.setParent(body);

        leftEye.setParent(head);
        rightEye.setParent(head);

        let leftFrontLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        leftFrontLegLimb.name = "leftFrontLegLimb";
        leftFrontLegLimb.setParent(body);
        leftFrontLegLimb.setPosition(-30, -20, -30);

        let leftFrontLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        leftFrontLeg.name = "leftFrontLeg";
        leftFrontLeg.setParent(leftFrontLegLimb);
        leftFrontLeg.setPosition(0, 0, 0);

        let leftMiddleLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        leftMiddleLegLimb.name = "leftMiddleLegLimb";
        leftMiddleLegLimb.setParent(body);
        leftMiddleLegLimb.setPosition(-30, -20, 0);

        let leftMiddleLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        leftMiddleLeg.name = "leftMiddleLeg";
        leftMiddleLeg.setParent(leftMiddleLegLimb);
        leftMiddleLeg.setPosition(0, 0, 0);

        let leftBackLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        leftBackLegLimb.name = "leftBackLegLimb";
        leftBackLegLimb.setParent(body);
        leftBackLegLimb.setPosition(-30, -20, 30);

        let leftBackLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        leftBackLeg.name = "leftBackLeg";
        leftBackLeg.setParent(leftBackLegLimb);
        leftBackLeg.setPosition(0, 0, 0);

        let rightFrontLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        rightFrontLegLimb.name = "rightFrontLegLimb";
        rightFrontLegLimb.setParent(body);
        rightFrontLegLimb.setPosition(30, -20, -30);

        let rightFrontLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        rightFrontLeg.name = "rightFrontLeg";
        rightFrontLeg.setParent(rightFrontLegLimb);
        rightFrontLeg.setPosition(0, 0, 0);

        let rightMiddleLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        rightMiddleLegLimb.name = "rightMiddleLegLimb";
        rightMiddleLegLimb.setParent(body);
        rightMiddleLegLimb.setPosition(30, -20, 0);

        let rightMiddleLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        rightMiddleLeg.name = "rightMiddleLeg";
        rightMiddleLeg.setParent(rightMiddleLegLimb);
        rightMiddleLeg.setPosition(0, 0, 0);

        let rightBackLegLimb = new Mesh(
            new BoxGeometry(1, 1, 1, false),
            materialEye
        );
        rightBackLegLimb.name = "rightBackLegLimb";
        rightBackLegLimb.setParent(body);
        rightBackLegLimb.setPosition(30, -20, 30);

        let rightBackLeg = new Mesh(
            new BoxGeometry(150, 20, 20, false),
            materialEye
        );
        rightBackLeg.name = "rightBackLeg";
        rightBackLeg.setParent(rightBackLegLimb);
        rightBackLeg.setPosition(0, 0, 0);

        scene.setActiveCamera(PerspectiveCamera)
        perspectiveCamera.setPosition(0, 0, 1000)
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

        const perspectiveCamera = new PerspectiveCamera(
            60,
            canvas.width / canvas.height,
            0.1,
            20000,
            1)
        perspectiveCamera.name = "PerspectiveCamera"
        perspectiveCamera.setParent(originNode)
    
        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            -1000,
            +1000
        )
        orthographicCamera.name = "OrthoCamera"
        orthographicCamera.setParent(originNode)
    
        const obliqueCamera = new ObliqueCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            -1000,
            +1000
        )
        obliqueCamera.name = "ObliqueCamera"
        obliqueCamera.setParent(originNode)

        ring.setPosition(0, 50, 300);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        ring.setParent(scene);

        scene.setActiveCamera(PerspectiveCamera);
        perspectiveCamera.setPosition(0, 0, 1000);
        return scene;
    }
}
