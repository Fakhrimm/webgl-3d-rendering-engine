import { BufferGeometry } from "./bufferGeometry";
import { BufferAttribute } from "./bufferAttribute";

export class SphereGeometry extends BufferGeometry {
    radius: number;
    widthSegments: number;
    heightSegments: number;

    constructor(radius = 1, widthSegments = 32, heightSegments = 16) {
        super();
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;

        const vertices = [];
        const indices = [];
        const texcoord = [];
        const normals = [];

        for (let y = 0; y <= heightSegments; y++) {
            const theta = y * Math.PI / heightSegments;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let x = 0; x <= widthSegments; x++) {
                const phi = x * 2 * Math.PI / widthSegments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const vx = cosPhi * sinTheta;
                const vy = cosTheta;
                const vz = sinPhi * sinTheta;

                const nx = vx;
                const ny = vy;
                const nz = vz;

                const u = x / widthSegments;
                const v = y / heightSegments;

                vertices.push(this.radius * vx, this.radius * vy, this.radius * vz, 1);
                normals.push(nx, ny, nz);
                texcoord.push(u, v);
            }
        }

        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < widthSegments; x++) {
                const a = (y * (widthSegments + 1)) + x;
                const b = a + widthSegments + 1;
                const c = a + 1;
                const d = b + 1;

                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }

        this.setAttribute('a_position', new BufferAttribute(new Float32Array(vertices), 4));
        this.setAttribute('a_normal', new BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('a_texcoord', new BufferAttribute(new Float32Array(texcoord), 2));
        this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    }

    // static fromJSON(json: any): SphereGeometry {
    //     return new SphereGeometry(json.radius, json.widthSegments, json.heightSegments);
    // }
    //
    // public toJSON(): object {
    //     return {
    //         ...super.toJSON(),
    //         radius: this.radius,
    //         widthSegments: this.widthSegments,
    //         heightSegments: this.heightSegments
    //     };
    // }
}