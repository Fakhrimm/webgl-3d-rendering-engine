import { IObliqueCamera } from "../Utils/model-interface";
import {Camera} from "./camera";
import {NodeTypes} from "../Types/node-types.ts";
import {Euler} from "../Math/euler.ts";

export class ObliqueCamera extends Camera {
    top: number;
    bottom: number;
    left: number;
    right: number;
    near: number;
    far: number;
    alpha: number;
    beta: number;

    constructor(left = - 1, right = 1, top = 1, bottom = - 1, near = 0.1, far = 2000) {
        super();
        this.nodeType = NodeTypes.OBLIQUE_CAMERA;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.alpha = 0.001;
        this.beta = Math.PI/4;

        this.computeProjectionMatrix();
    }

    computeProjectionMatrix() {
        const dx = ( this.right - this.left ) / ( 2 * this.zoom );
        const dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
        const cx = ( this.right + this.left ) / 2;
        const cy = ( this.top + this.bottom ) / 2;

        let left = cx - dx;
        let right = cx + dx;
        let top = cy + dy;
        let bottom = cy - dy;

        this._projectionMatrix.oblique(left, right, top, bottom, this.near, this.far, this.alpha, this.beta);
    }

    override setZoom(newZoom: number) {
        super.setZoom(newZoom);
        this.computeProjectionMatrix();
    }

    public toRaw(): IObliqueCamera {
        const raw = super.toRaw()
        return {
            name: raw.name,
            nodeType: raw.nodeType,
            position: raw.position, 
            scale: raw.scale,
            rotation: raw.rotation,
            children: raw.children,
			left: this.left,
			right: this.right,
			top: this.top,
			bottom: this.bottom,
			near: this.near,
			far: this.far,
            alpha: this.alpha,
            beta: this.beta,
			zoom: this.zoom
        }
    }
    public static fromRaw(raw: IObliqueCamera): ObliqueCamera {
        const camera = new ObliqueCamera();
        camera.name = raw.name;
        camera.setPosition(raw.position.x, raw.position.y, raw.position.z);
        camera.setScale(raw.scale.x, raw.scale.y, raw.scale.z);
        camera.setRotationFromEuler(new Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z));
        camera.left = raw.left;
        camera.right = raw.right;
        camera.top = raw.top;
        camera.bottom = raw.bottom;
        camera.near = raw.near;
        camera.far = raw.far;
        camera.alpha = raw.alpha;
        camera.beta = raw.beta;
        camera.zoom = raw.zoom;
        return camera;
    }
}
