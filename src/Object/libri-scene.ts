import { Node } from "./node.ts";
import { Mesh } from "./mesh.ts";
import { BoxGeometry } from "../Geometry/boxGeometry.ts";
import { BasicMaterial } from "../Material/basic-material.ts";
import { OrthographicCamera } from "../Camera/orthographic-camera.ts";
import { Camera } from "../Camera/camera.ts";
import { ObliqueCamera } from "../Camera/oblique-camera.ts";
import { PerspectiveCamera } from "../Camera/perspective-camera.ts";
import { Scene } from "./scene.ts";
import { Color } from "../Math/color.ts";
import { PipeHollow } from "../Geometry/pipeHollow.ts";

export class LibriScene extends Scene {
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

    public static createSceneSlime(canvas: HTMLCanvasElement | null): LibriScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        // Create new scene
        const scene = new LibriScene();
        scene.name = "SlimeScene";

        // Create origin node
        const originNode = new Node();
        originNode.name = "OriginNode";

        // Create cameras
        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            1000,
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
            0.1,
            20000,
            1
        );
        perspectiveCamera.name = "PerspectiveCamera";
        perspectiveCamera.setPosition(0, 0, 1000);
        orthographicCamera.setPosition(0, 0, 650);

        // Create material for meshes
        let material1 = new BasicMaterial(Color.SLIMEGREEN);
        let material2 = new BasicMaterial(Color.SLIMEGRAY);
        let material3 = new BasicMaterial(Color.SLIMMEDARKGREEN);

        // Create slime head
        let head = new Mesh(new BoxGeometry(150, 150, 125, false), material1);
        head.name = "Head";

        // Create slime eyes
        let eye1 = new Mesh(new BoxGeometry(33, 33, 18, false), material2);
        eye1.name = "Eye1";
        let eye2 = new Mesh(new BoxGeometry(33, 33, 18, false), material2);
        eye2.name = "Eye2";

        // Create slime mouth
        let mouth = new Mesh(new BoxGeometry(21, 21, 18, false), material2);
        mouth.name = "Mouth";

        // Create slime body
        let body = new Mesh(new BoxGeometry(190, 240, 100, false), material3);
        body.name = "Body";

        // Create right hand joint
        let rightHandJoint = new Node();
        rightHandJoint.name = "RightHandJoint";

        // Create slime right hand
        let rightHand = new Mesh(new BoxGeometry(75, 240, 50, false), material1);
        rightHand.name = "RightHand";

        // Create left hand joint
        let leftHandJoint = new Node();
        leftHandJoint.name = "LeftHandJoint";

        // Create slime left hand
        let leftHand = new Mesh(new BoxGeometry(75, 240, 50, false), material1);
        leftHand.name = "LeftHand";

        // Create right leg joint
        let rightLegJoint = new Node();
        rightLegJoint.name = "RightLegJoint";

        // Create slime right leg
        let rightLeg = new Mesh(new BoxGeometry(90, 220, 50, false), material1);
        rightLeg.name = "RightLeg";

        // Create left leg joint
        let leftLegJoint = new Node();
        leftLegJoint.name = "LeftLegJoint";

        // Create slime left leg
        let leftLeg = new Mesh(new BoxGeometry(90, 220, 50, false), material1);
        leftLeg.name = "LeftLeg";

        // Set position for all slime parts
        head.setPosition(0, 195, 0);
        eye1.setPosition(-36, 21, 60);
        eye2.setPosition(36, 21, 60);
        mouth.setPosition(12, -30, 60);

        body.setPosition(0, 0, 0);

        rightHandJoint.setPosition(130, 120, 0);
        rightHand.setPosition(0, -120, 0);

        leftHandJoint.setPosition(-130, 120, 0);
        leftHand.setPosition(0, -120, 0);

        rightLegJoint.setPosition(45, -120, 0);
        rightLeg.setPosition(0, -110, 0);

        leftLegJoint.setPosition(-45, -120, 0);
        leftLeg.setPosition(0, -110, 0);

        // Setting parent for all node
        originNode.setParent(scene);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        head.setParent(body);
        eye1.setParent(head);
        eye2.setParent(head);
        mouth.setParent(head);

        body.setParent(scene);

        rightHandJoint.setParent(body);
        rightHand.setParent(rightHandJoint);

        leftHandJoint.setParent(body);
        leftHand.setParent(leftHandJoint);

        rightLegJoint.setParent(body);
        rightLeg.setParent(rightLegJoint);

        leftLegJoint.setParent(body);
        leftLeg.setParent(leftLegJoint);

        scene.setActiveCamera(PerspectiveCamera);
        return scene;
    }

    public static createScenePipe(canvas: HTMLCanvasElement | null): LibriScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        // Create new scene
        const scene = new LibriScene();
        scene.name = "PipeScene";

        // Create origin node
        const originNode = new Node();
        originNode.name = "OriginNode";

        // Create cameras
        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            1000,
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
            0.1,
            20000,
            1
        );
        perspectiveCamera.name = "PerspectiveCamera";
        perspectiveCamera.setPosition(0, 0, 1000);
        orthographicCamera.setPosition(0, 0, 650);

        // Create material for meshes
        let material1 = new BasicMaterial(Color.BLACK);

        // Create pipe
        let pipe = new Mesh(new PipeHollow(), material1);
        pipe.name = "Pipe";

        // Setting parent for all node
        originNode.setParent(scene);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        pipe.setParent(scene);

        scene.setActiveCamera(PerspectiveCamera);
        return scene;
    }   
}
