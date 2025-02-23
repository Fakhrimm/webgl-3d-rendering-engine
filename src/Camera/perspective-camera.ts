import { IPerspectiveCamera } from "../Utils/model-interface";
import {Camera} from "./camera";
import {NodeTypes} from "../Types/node-types.ts";
import {Euler} from "../Math/euler.ts";

export class PerspectiveCamera extends Camera {
    fov: number;
    near: number;
    far: number;
    aspect: number;

	constructor(fov = 60, aspect = 1, near = 0.1, far = 2000, zoom: number = 1) {
		super();
		this.nodeType = NodeTypes.PERSPECTIVE_CAMERA;
		this.fov = fov;
		this.near = near;
		this.far = far;
		this.aspect = aspect;
		this.zoom = zoom;

		this.computeProjectionMatrix();

	}

    computeProjectionMatrix() {
		const near = this.near;
		let top = near * Math.tan((Math.PI / 180) * 0.5 * this.fov ) / this.zoom;
		let height = 2 * top;
		let width = this.aspect * height;
		let left = - 0.5 * width;

		this._projectionMatrix.perspective(left, left + width, top, top - height, near, this.far);
	}

	override setZoom(newZoom: number) {
		super.setZoom(newZoom);
		this.computeProjectionMatrix()
	}

	setFov(fov: number) {
		this.fov = fov;
		this.computeProjectionMatrix();
	}

	public toRaw(): IPerspectiveCamera {
		const raw = super.toRaw()
        return {
            name: raw.name,
			nodeType: raw.nodeType,
            position: raw.position, 
            scale: raw.scale,
            rotation: raw.rotation,
            children: raw.children,
			fov: this.fov,
			aspect: this.aspect,
			near: this.near,
			far: this.far,
			zoom: this.zoom
        }
	}
	public static fromRaw(raw: IPerspectiveCamera): PerspectiveCamera {
		const camera = new PerspectiveCamera(
			raw.fov,
			raw.aspect,
			raw.near,
			raw.far,
			raw.zoom);
		camera.name = raw.name;
		camera.setPosition(raw.position.x, raw.position.y, raw.position.z);
		camera.setScale(raw.scale.x, raw.scale.y, raw.scale.z);
		camera.setRotationFromEuler(new Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z));
		return camera;
	}
}

