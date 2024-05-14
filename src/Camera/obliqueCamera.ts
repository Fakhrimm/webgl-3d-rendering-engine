import { CameraType } from "../Types/camera-types";
import { Camera } from "./camera";

export class ObliqueCamera extends Camera {
    top: number;
    bottom: number;
    left: number;
    right: number;
    near: number;
    far: number;
    alpha: number;
    beta: number;
  
    constructor(
      left: number,
      right: number,
      bottom: number,
      top: number,
      near: number,
      far: number,
    ) {
      super(); // Setup Node
      this.left = left;
      this.right = right;
      this.top = top;
      this.bottom = bottom;
      this.near = near;
      this.far = far;
      this.alpha = 0.5;
      this.beta = Math.PI / 4;
      // Jangan lupa untuk panggil computeProjectionMatrix() setiap
      // kali mengubah nilai left, right, top, bottom, near, atau far.
      this.computeProjectionMatrix();
    }

    computeProjectionMatrix() {
        // M4.orthographic() menghasilkan proyeksi matriks ortografik
        // dengan 6 tupel left, right, bottom, top, near, dan far.
        this._projectionMatrix.oblique(
          this.left,
          this.right,
          this.bottom,
          this.top,
          this.near,
          this.far,
          this.alpha, 
          this.beta
        );
      }

    override getCameraType() {
        return CameraType.OBLIQUE;
    }
}
