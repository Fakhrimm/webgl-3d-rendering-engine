import { BufferGeometry } from "./bufferGeometry";
import { BufferAttribute } from "./bufferAttribute";

export class ConeGeometry extends BufferGeometry {
    radius: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;

    constructor(radius = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
        super();
        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.heightSegments = heightSegments;
        this.openEnded = openEnded;

        const vertices = [];
        const indices = [];
        const normals = [];
        const texcoords = [];

        // Generate vertices, normals and uvs
        const halfHeight = height / 2;

        // Side vertices
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const currentRadius = v * radius;
            const yPos = v * height - halfHeight;

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * 2 * Math.PI;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const vertexX = currentRadius * cosTheta;
                const vertexY = yPos;
                const vertexZ = currentRadius * sinTheta;

                vertices.push(vertexX, vertexY, vertexZ, 1);
                normals.push(cosTheta, 0, sinTheta);
                texcoords.push(u, v);
            }
        }

        // Indices for the side
        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = (y * (radialSegments + 1)) + x;
                const b = a + radialSegments + 1;
                const c = a + 1;
                const d = b + 1;

                indices.push(a, b, d);
                indices.push(a, d, c);
            }
        }

        if (!openEnded) {
            // Base vertices
            const baseCenterIndex = vertices.length / 4;
            vertices.push(0, -halfHeight, 0, 1); // Center vertex
            normals.push(0, -1, 0);
            texcoords.push(0.5, 0.5);

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * 2 * Math.PI;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const vertexX = radius * cosTheta;
                const vertexZ = radius * sinTheta;

                vertices.push(vertexX, -halfHeight, vertexZ, 1);
                normals.push(0, -1, 0);
                texcoords.push((cosTheta + 1) / 2, (sinTheta + 1) / 2);

                if (x > 0) {
                    indices.push(baseCenterIndex, baseCenterIndex + x, baseCenterIndex + x + 1);
                }
            }
        }

        this.setAttribute('a_position', new BufferAttribute(new Float32Array(vertices), 4));
        this.setAttribute('a_normal', new BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('a_texcoord', new BufferAttribute(new Float32Array(texcoords), 2));
        this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    }

    // static fromJSON(json: any): ConeGeometry {
    //     return new ConeGeometry(json.radius, json.height, json.radialSegments, json.heightSegments, json.openEnded);
    // }
    //
    // public toJSON(): object {
    //     return {
    //         ...super.toJSON(),
    //         radius: this.radius,
    //         height: this.height,
    //         radialSegments: this.radialSegments,
    //         heightSegments: this.heightSegments,
    //         openEnded: this.openEnded
    //     };
    // }
}