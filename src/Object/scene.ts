import {Node} from "./node";
import {OrthographicCamera} from "../Camera/orthographic-camera.ts";
import {Camera} from "../Camera/camera.ts";
import {ObliqueCamera} from "../Camera/oblique-camera.ts";
import {PerspectiveCamera} from "../Camera/perspective-camera.ts";
import {ISceneNode} from "../Utils/model-interface.ts";
import {Euler} from "../Math/euler.ts";
import {NodeTypes} from "../Types/node-types.ts";

export class Scene extends Node {
    activeCamera: Camera | null = null;

    constructor() {
        super();
        this.nodeType = NodeTypes.SCENE;
        this.parent = null;
    }

    public getActiveCamera(): Camera | null {
        return this.activeCamera;
    }

    public static fromRaw(raw: ISceneNode): Scene {
        const scene = new Scene();
        scene.name = raw.name;
        scene.setPosition(raw.position.x, raw.position.y, raw.position.z);
        scene.setScale(raw.scale.x, raw.scale.y, raw.scale.z);
        scene.setRotationFromEuler(new Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z));
        scene.updateLocalMatrix()
        return scene;
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
        const origin = this.getOriginNode();
        origin.setPosition(0, 0, 0);
        origin.setScale(1, 1, 1);
        origin.setRotationFromEuler(new Euler(0, 0, 0));

        const orthographicCamera = origin.searchCamera(OrthographicCamera);
        const obliqueCamera = origin.searchCamera(ObliqueCamera);
        const perspectiveCamera = origin.searchCamera(PerspectiveCamera);

        if (!orthographicCamera || !obliqueCamera || !perspectiveCamera) {
            throw new Error("Missing camera found in the scene");
        }
        orthographicCamera.toDefault();
        obliqueCamera.toDefault();
        perspectiveCamera.toDefault();
    }

    setActiveCameraZoom(zoom: number): void {
        if (this.activeCamera) {
            this.activeCamera.setZoom(zoom);
        }
    }

    getOriginNode(): Node {
        return this.getChildren()[0];
    }
}
