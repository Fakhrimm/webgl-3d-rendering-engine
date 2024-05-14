import {Matrix4} from "./matrix-4.ts";
import {Vector3} from "./vector-3.ts";
import {clamp} from "./math-util.ts";
import {Quaternion} from "./quaternion.ts";

export class Euler {

    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;
	private readonly  _order = 'XYZ';

	constructor( x = 0, y = 0, z = 0) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	get x() {
		return this._x;
	}

	set x( value:number ) {
		this._x = value;
		this._onChangeCallback();
	}

	get y() {
		return this._y;
	}

	set y( value: number ) {
		this._y = value;
		this._onChangeCallback();
	}

	get z() {
		return this._z;
	}

	set z( value: number ) {
		this._z = value;
		this._onChangeCallback();
	}

	get order() {
		return this._order;
	}

	set( x: number, y: number, z: number ) {
		this._x = x;
		this._y = y;
		this._z = z;

		this._onChangeCallback();
		return this;
	}

	clone() {
		return new Euler(this._x, this._y, this._z);
	}

	copy( euler: Euler ) {
		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._onChangeCallback();
		return this;
	}

	setFromRotationMatrix( m: Matrix4, update = true ) {
		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.elements;
		const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		// @ts-ignore
		const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		// @ts-ignore
		const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		switch ( this._order ) {
			case 'XYZ':
				this._y = Math.asin( clamp( m13, - 1, 1 ) );
				if ( Math.abs( m13 ) < 0.9999999 ) {
					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );
				} else {
					this._x = Math.atan2( m32, m22 );
					this._z = 0;
				}
				break;
			default:
		}
		if ( update ) this._onChangeCallback();
		return this;

	}

	setFromQuaternion( q: Quaternion, update: boolean ) {
		_matrix.makeRotationFromQuaternion( q );
		return this.setFromRotationMatrix( _matrix, update );
	}

	setFromVector3( v: Vector3 ) {
		return this.set( v.x, v.y, v.z );
	}

	equals( euler: Euler ) {
		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z )
	}

	_onChange( callback: () => void ) {

		this._onChangeCallback = callback;

		return this;

	}

	_onChangeCallback() {}

}

const _matrix = /*@__PURE__*/ new Matrix4();