import {Matrix4} from "../Math/matrix-4";
import {Node} from "../Object/node";
import {CameraType} from "../Types/camera-types";

export class Camera extends Node {
    protected _projectionMatrix = new Matrix4().identity();
    private _invWorldMatrix = new Matrix4().identity();

    constructor() {
        super();
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

    getCameraType(): CameraType {
        return CameraType.BASE;
    }


    // static fromJSON(json: any): Camera {
    //     return new Camera();
    // }

    // toJSON() {
    //     console.log("Camera toJSON");
    // }
}
