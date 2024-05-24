import { Matrix4 } from "../Math/matrix-4";
import { Node } from "../Object/node";
import { Euler } from "../Math/euler";

export class Camera extends Node {
    protected _projectionMatrix = new Matrix4().identity();
    private _invWorldMatrix = new Matrix4().identity();
    protected zoom: number;

    constructor() {
        super();
        this.zoom = 1;
    }

    get viewProjectionMatrix() {
        this._invWorldMatrix = this.worldMatrix.clone().invert();
        return this._projectionMatrix.clone().multiply(this._invWorldMatrix);
    }

    computeProjectionMatrix() {
        throw new Error(
            "Camera.computeProjectionMatrix() must be implemented in derived classes."
        );
    }

    getZoom(): number {
        return this.zoom;
    }

    setZoom(newZoom: number) {
        this.zoom = newZoom;
    }

    toDefault() {
        this.setLocalMatrix(new Matrix4().identity());
        this.updateWorldMatrix();
        this.setZoom(1);
    }

    setRotationY(y: number) {
        const currentRotation = this.getRotation();
        this.setRotationFromEuler(
            new Euler(currentRotation.x, y, currentRotation.z)
        );
    }
}
