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
}

// const _vector = new Vector3();
// const _quaternion = new Quaternion();

export { Vector3 };
