import {Matrix4} from "./matrix-4.ts";
import {Euler} from "./euler.ts";
import {clamp} from "./math-util.ts";
import {Vector3} from "./vector-3.ts";

class Quaternion {
    public _x: number
    public _y: number
    public _z: number
    public _w: number

	constructor( x = 0, y = 0, z = 0, w = 1 ) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
	}

	get x() {
		return this._x;
	}

	set x( value: number ) {
		this._x = value;
		this._onChangeCallback();
	}

	get y() {
		return this._y;
	}

	set y( value: any ) {
		this._y = value;
		this._onChangeCallback();
	}

	get z() {
		return this._z;
	}

	set z( value: any ) {
		this._z = value;
		this._onChangeCallback();
	}

	get w() {
		return this._w;
	}

	set w(value: any) {
		this._w = value;
		this._onChangeCallback();
	}

	set( x: number, y: number, z: number, w: number ) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
		this._onChangeCallback();
		return this;
	}

	clone() {
		return new Quaternion( this._x, this._y, this._z, this._w );
	}

	copy( quaternion: Quaternion ) {
		this._x = quaternion._x;
		this._y = quaternion._y;
		this._z = quaternion._z;
		this._w = quaternion._w;
		this._onChangeCallback();
		return this;
	}

	setFromEuler( euler: Euler, update = true ) {

		const x = euler.x, y = euler.y, z = euler.z, order = euler.order;
		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );
		switch ( order ) {
			case 'XYZ':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			default:
				console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );
		}
		if ( update ) this._onChangeCallback();
		return this;
	}

	setFromRotationMatrix( m: Matrix4 ) {
		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.elements,
			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],
			trace = m11 + m22 + m33;

		if ( trace > 0 ) {
			const s = 0.5 / Math.sqrt( trace + 1.0 );
			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {
			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {
			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {
			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;
		}
		this._onChangeCallback();
		return this;
	}

	setFromAxisAngle( axis: Vector3, angle: number ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		const halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this._onChangeCallback();

		return this;

	}

	angleTo( q: Quaternion ) {
		return 2 * Math.acos( Math.abs( clamp( this.dot( q ), - 1, 1 ) ) );

	}

	rotateTowards( q: Quaternion, step: number ) {
		const angle = this.angleTo( q );
		if ( angle === 0 ) return this;

		const t = Math.min( 1, step / angle );
		this.slerp( q, t );

		return this;

	}

	identity() {
		return this.set( 0, 0, 0, 1 );
	}

	invert() {
		// quaternion is assumed to have unit length
		return this.conjugate();
	}

	conjugate() {
		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this._onChangeCallback();
		return this;
	}

	dot( v: Quaternion ) {
		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
	}
	length() {
		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );
	}

	normalize() {
		let l = this.length();
		if ( l === 0 ) {
			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {
			l = 1 / l;
			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}
		this._onChangeCallback();
		return this;
	}

	multiply( q: Quaternion ) {
		return this.multiplyQuaternions( this, q );
	}

	premultiply( q: Quaternion ) {
		return this.multiplyQuaternions( q, this );
	}

	multiplyQuaternions( a: Quaternion, b: Quaternion ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this._onChangeCallback();

		return this;

	}

	slerp( qb: Quaternion, t: number ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		const x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if ( sqrSinHalfTheta <= Number.EPSILON ) {

			const s = 1 - t;
			this._w = s * w + t * this._w;
			this._x = s * x + t * this._x;
			this._y = s * y + t * this._y;
			this._z = s * z + t * this._z;

			this.normalize(); // normalize calls _onChangeCallback()

			return this;

		}

		const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
		const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
		const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
			ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this._onChangeCallback();

		return this;

	}

	slerpQuaternions( qa: Quaternion, qb: Quaternion, t: number ) {

		return this.copy( qa ).slerp( qb, t );

	}

	random() {

		// sets this quaternion to a uniform random unit quaternnion

		// Ken Shoemake
		// Uniform random rotations
		// D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.

		const theta1 = 2 * Math.PI * Math.random();
		const theta2 = 2 * Math.PI * Math.random();

		const x0 = Math.random();
		const r1 = Math.sqrt( 1 - x0 );
		const r2 = Math.sqrt( x0 );

		return this.set(
			r1 * Math.sin( theta1 ),
			r1 * Math.cos( theta1 ),
			r2 * Math.sin( theta2 ),
			r2 * Math.cos( theta2 ),
		);

	}

	_onChange( callback: () => void ) {

		this._onChangeCallback = callback;

		return this;

	}

	_onChangeCallback() {}

}

export { Quaternion };