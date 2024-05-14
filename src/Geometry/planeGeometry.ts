import { BufferGeometry } from './bufferGeometry';
import { BufferAttribute } from './bufferAttribute';

export class PlaneGeometry extends BufferGeometry {
    width: number;
    height: number;

    constructor(width=1, height=1) {
        super();
        this.width = width;
        this.height = height;
        const hw = width/2, hh = height/2;
        const vertices = new Float32Array([
            -hw, -hh, 0, 1,
            hw, -hh, 0, 1,
            hw, hh, 0, 1,
            -hw, hh, 0, 1,
            -hw, -hh, 0, 1,
            hw, hh, 0, 1,
        ]);
        this.setAttribute('a_position', new BufferAttribute(vertices, 4));
        this.calculateNormals();
    }

    static fromJSON(json: any): PlaneGeometry {
        return new PlaneGeometry(json.width, json.height);
    }

    public toJSON(): object {
        return {
            ...super.toJSON(),
            width: this.width,
            height: this.height,
        };
    }
}
