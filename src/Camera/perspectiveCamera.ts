import { CameraType } from "../Types/camera-types";
import { Camera } from "./camera";

export class PerspectiveCamera extends Camera {
    constructor() {
        super();
    }

    computeProjectionMatrix() {}

    override getCameraType() {
        return CameraType.PERSPECTIVE;
    }
}

