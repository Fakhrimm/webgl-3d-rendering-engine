import { Matrix4 } from "./matrix-4";
import {clamp} from "./math-util.ts";

class Vector3 {
    x: number;
    y: number;
    z: number;

	constructor( x = 0, y = 0, z = 0 ) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

	set( x: number, y: number, z:number ) {

		if ( z === undefined ) z = this.z;

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	}

	setScalar( scalar: number ) {

		this.x = scalar;
		this.y = scalar;
		this.z = scalar;

		return this;

	}

	setX( x: number ) {

		this.x = x;

		return this;

	}

	setY( y: number ) {

		this.y = y;

		return this;

	}

	setZ( z: number ) {

		this.z = z;

		return this;

	}

	setComponent( index: number, value: number ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

		return this;

	}

	getComponent( index: number ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	}

	clone() {
		return new Vector3( this.x, this.y, this.z );
	}

	copy( v: Vector3) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	}

	add( v: Vector3 ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	}

	addScalar( s: number ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	}

	addVectors( a: Vector3, b: Vector3 ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	}

    applyMatrix4( m:Matrix4 ) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}

	sub( v: Vector3 ) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	cross( v: Vector3 ) {
		return this.crossVectors( this, v );
	}

	crossVectors( a: Vector3, b:Vector3 ) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	normalize() {
		return this.divideScalar( this.length() || 1 );
	}

	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}

	divideScalar( scalar: number ) {
		return this.multiplyScalar( 1 / scalar );
	}

	multiplyScalar( scalar:number ) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}
	angleTo( v: Vector3) {
		const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );
		if ( denominator === 0 ) return Math.PI / 2;

		const theta = this.dot( v ) / denominator;

		// clamp, to handle numerical problems
		return Math.acos(clamp( theta, - 1, 1 ) );
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	dot( v: Vector3) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	toNumberArray() {
		return [this.x, this.y, this.z];
	}
}

// const _vector = new Vector3();
// const _quaternion = new Quaternion();

export { Vector3 };
