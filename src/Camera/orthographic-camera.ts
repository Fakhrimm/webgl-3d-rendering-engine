import {Camera} from "./camera";

export class OrthographicCamera extends Camera {
	top: number;
	bottom: number;
	left: number;
	right: number;
	near: number;
	far: number;

	constructor(left = - 1, right = 1, top = 1, bottom = - 1, near = 0.1, far = 2000) {

		super();
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.near = near;
		this.far = far;

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

		this._projectionMatrix.orthographic(left, right, top, bottom, this.near, this.far);
	}

	override setZoom(newZoom: number) {
		super.setZoom(newZoom);
		this.computeProjectionMatrix();
	}
}
