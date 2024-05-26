import {Matrix4} from "../Math/matrix-4";
import {Node} from "../Object/node";
import {Euler} from "../Math/euler.ts";

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

    get viewMatrix() {
        return this.worldMatrix.clone().invert();
    }

    get projectionMatrix() {
        return this._projectionMatrix.clone();
    }

    get cameraPosition() {
        return this.getPosition().clone().applyMatrix4(this.worldMatrix);
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
        this.setPosition(0, 0, 1000);
        this.setRotationFromEuler(new Euler(0, 0, 0));
        this.setScale(1, 1, 1);
        this.setZoom(1);
    }
}
