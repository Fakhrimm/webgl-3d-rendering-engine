import { Node } from "./node";
import { OrthographicCamera } from "../Camera/orthographicCamera.ts";
import { Mesh } from "./mesh.ts";
import { Material } from "../Material/material.ts";
import { BoxGeometry } from "../Geometry/boxGeometry.ts";
import { Vector3 } from "../Math/vector-3.ts";
import { Euler } from "../Math/euler.ts";

export class Scene extends Node {
    constructor() {
        super();
        this.parent = null;
    }

    public static createSceneDummy(
        canvas: HTMLCanvasElement | null
    ): Scene {
        if (!canvas) {
            throw new Error("Canvas is null");
        }
        const scene = new Scene();
        scene.name = "SceneDummy";

        const orthographicCamera = new OrthographicCamera(
            -canvas.width / 2,
            canvas.width / 2,
            -canvas.height / 2,
            canvas.height / 2,
            -101,
            101
        );

        let mesh = new Mesh(new BoxGeometry(50, 200, 1), new Material());
        mesh.name = "Mesh";

        let mesh2 = new Mesh(new BoxGeometry(200, 50, 1), new Material());
        mesh2.name = "Mesh2";

        orthographicCamera.setParent(scene);
        mesh.setParent(scene);
        mesh2.setParent(scene);

        return scene;
    }

    public setTranslate(translation: Partial<Vector3>) {
        if (translation.x !== undefined) this.getPosition().setX(translation.x);
        if (translation.y !== undefined) this.getPosition().setY(translation.y);
        if (translation.z !== undefined) this.getPosition().setZ(translation.z);
        // this.updateLocalMatrix();
    }

    public setScale(scale: Partial<Vector3>) {
        if (scale.x !== undefined) this.getScale().setX(scale.x);
        if (scale.y !== undefined) this.getScale().setY(scale.y);
        if (scale.z !== undefined) this.getScale().setZ(scale.z);
        // this.updateLocalMatrix();
    }

    public setRotate(rotation: Partial<Euler>) {
        if (rotation.x !== undefined) this.getRotation().x = rotation.x;
        if (rotation.y !== undefined) this.getRotation().y = rotation.y;
        if (rotation.z !== undefined) this.getRotation().z = rotation.z;
        // this.updateLocalMatrix();
    }
}
