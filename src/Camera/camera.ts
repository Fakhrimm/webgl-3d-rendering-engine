import { Matrix4 } from "../Math/matrix-4";
import { Node } from "../Object/node";
import { Euler } from "../Math/euler";

export class Camera extends Node {
    protected _projectionMatrix = new Matrix4().identity();
    private _invWorldMatrix = new Matrix4().identity();
    protected zoom: number;
    private rotationX: number = 0;
    private rotationY: number = 0;

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
        this.rotationX = 0;
        this.rotationY = 0;
    }

    setRotationCameraX(deltaX: number) {
        this.rotationX += deltaX;
        const currentRotation = this.getRotation();
        this.setRotationFromEuler(
            new Euler(this.rotationX, currentRotation.y, currentRotation.z)
        );
    }

    setRotationCameraY(deltaY: number) {
        this.rotationY += deltaY;
        const currentRotation = this.getRotation();
        this.setRotationFromEuler(
            new Euler(currentRotation.x, this.rotationY, currentRotation.z)
        );
    }
}
