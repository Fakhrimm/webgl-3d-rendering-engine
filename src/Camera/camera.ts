import { Matrix4 } from "../Math/matrix-4";
import { Node } from "../Object/node";

export class Camera extends Node {
  protected _projectionMatrix = new Matrix4().identity();
  private _invWorldMatrix = new Matrix4().identity();

  constructor() {
    super();
  }

  static fromJSON(json: any): Camera {
    return new Camera();
  }
  toJSON() {
    console.log("Camera toJSON");
  }

  computeWorldMatrix() {
    // super.computeWorldMatrix();
    this._invWorldMatrix = this.worldMatrix.clone().invert();
  }

  get viewProjectionMatrix() {
    this.computeWorldMatrix();
    return this._projectionMatrix.premultiply(this._invWorldMatrix);
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }

  computeProjectionMatrix() {
    throw new Error(
      "Camera.computeProjectionMatrix() must be implemented in derived classes."
    );
  }
}
