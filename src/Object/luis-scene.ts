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
import { Orb } from "../Geometry/orb.ts";
import { DiffuseTextureTypes } from "../Types/diffuse_texture_types.ts";
import { TextureTypes } from "../Types/texture-types.ts";

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

        let material1 = new BasicMaterial(Color.GREEN, TextureTypes.DIFFUSE_WOOD);
        let material2 = new BasicMaterial(Color.BLACK, TextureTypes.NORMAL_WOOD);
        let material3 = new BasicMaterial(Color.DARKGREEN, TextureTypes.DIFFUSE_BRICKS);

        let head = new Mesh(new BoxGeometry(90, 90, 90, true), material1);
        head.name = "head";

        let body = new Mesh(new BoxGeometry(75, 170, 75, false), material3);
        body.name = "body";

        let leftLegFrontLimb = new Mesh(new BoxGeometry(1, 1, 1, false), material2);
        leftLegFrontLimb.name = "leftLegFrontLimb";

        let leftLegFront = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        leftLegFront.name = "leftLegFront";

        let leftLegBackLimb = new Mesh(new BoxGeometry(1, 1, 1, false), material2);
        leftLegBackLimb.name = "leftLegBackLimb";

        let leftLegBack = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        leftLegBack.name = "leftLegBack";
        
        let rightLegBackLimb = new Mesh(new BoxGeometry(1, 1, 1, false), material2);
        rightLegBackLimb.name = "rightLegBackLimb";

        let rightLegBack = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        rightLegBack.name = "rightLegBack";
        
        let rightLegFrontLimb = new Mesh(new BoxGeometry(1, 1, 1, false), material2);
        rightLegFrontLimb.name = "rightLegFrontLimb";

        let rightLegFront = new Mesh(new BoxGeometry(25, 40, 25, false), material2);
        rightLegFront.name = "rightLegFront";

        const perspectiveCamera = new PerspectiveCamera(
            60,
            canvas.width / canvas.height,
            0.1,
            20000,
            1)
        perspectiveCamera.name = "PerspectiveCamera"
        perspectiveCamera.setPosition(0, 0, 1000)
    
        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            -1000,
            +1000
        )
        orthographicCamera.name = "OrthoCamera"
    
        const obliqueCamera = new ObliqueCamera(
            -canvas.width / 2,
            canvas.width / 2,
            canvas.height / 2,
            -canvas.height / 2,
            1000,
            -1000
        )
        obliqueCamera.name = "ObliqueCamera"

        head.setPosition(0, 130, 0);
        body.setPosition(0, 50, 300);
        leftLegFrontLimb.setPosition(30, -80, -25);
        leftLegFront.setPosition(20, -18, -25);
        leftLegBackLimb.setPosition(-30, -80, -25);
        leftLegBack.setPosition(-20, -18, -25);
        rightLegBackLimb.setPosition(-30, -80, 25);
        rightLegBack.setPosition(-20, -18, 25);
        rightLegFrontLimb.setPosition(30, -80, 25);
        rightLegFront.setPosition(20, -18, 0);

        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);

        body.setParent(scene);
        head.setParent(body);
        leftLegFrontLimb.setParent(body);
        leftLegFront.setParent(leftLegFrontLimb);
        rightLegFrontLimb.setParent(body);
        rightLegFront.setParent(rightLegFrontLimb);
        leftLegBackLimb.setParent(body);
        leftLegBack.setParent(leftLegBackLimb);
        rightLegBackLimb.setParent(body);
        rightLegBack.setParent(rightLegBackLimb);

        scene.setActiveCamera(PerspectiveCamera)
        return scene;
    }

    public static createOrbScene(canvas: HTMLCanvasElement | null): LuisScene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new LuisScene();
        scene.name = "OrbScene";

        const originNode = new Node();
        originNode.name = "OriginNode";
        originNode.setParent(scene);

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
        orthographicCamera.setParent(originNode);
        obliqueCamera.setParent(originNode);
        perspectiveCamera.setParent(originNode);


        let material1 = new PhongMaterial();
        let orb = new Mesh(new Orb(), material1);
        orb.name = "Orb";
        orb.setParent(scene);
        orb.setRotationY(-1.3);

        scene.setActiveCamera(PerspectiveCamera)
        return scene;
    }
}
