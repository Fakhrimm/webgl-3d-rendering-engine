import { BufferGeometry } from "./bufferGeometry";
import { BufferAttribute } from "./bufferAttribute";

export class CylinderGeometry extends BufferGeometry {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;

    constructor(radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 32, heightSegments = 1, openEnded = false) {
        super();
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radialSegments = radialSegments;
        this.heightSegments = heightSegments;
        this.openEnded = openEnded;

        const vertices = [];
        const indices = [];
        const normals = [];

        const halfHeight = height / 2;

        // Generate vertices and normals 
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments;
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
            const yPos = v * height - halfHeight;

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * 2 * Math.PI;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const vertexX = radius * cosTheta;
                const vertexY = yPos;
                const vertexZ = radius * sinTheta;

                vertices.push(vertexX, vertexY, vertexZ, 1);
                normals.push(cosTheta, 0, sinTheta);
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
            // Bottom cap vertices
            const bottomCenterIndex = vertices.length / 4;
            vertices.push(0, -halfHeight, 0, 1); // Center vertex
            normals.push(0, -1, 0);

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * 2 * Math.PI;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const vertexX = radiusBottom * cosTheta;
                const vertexZ = radiusBottom * sinTheta;

                vertices.push(vertexX, -halfHeight, vertexZ, 1);
                normals.push(0, -1, 0);

                if (x > 0) {
                    indices.push(bottomCenterIndex, bottomCenterIndex + x, bottomCenterIndex + x + 1);
                }
            }

            // Top cap vertices
            const topCenterIndex = vertices.length / 4;
            vertices.push(0, halfHeight, 0, 1); // Center vertex
            normals.push(0, 1, 0);

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * 2 * Math.PI;

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);

                const vertexX = radiusTop * cosTheta;
                const vertexZ = radiusTop * sinTheta;

                vertices.push(vertexX, halfHeight, vertexZ, 1);
                normals.push(0, 1, 0);

                if (x > 0) {
                    indices.push(topCenterIndex, topCenterIndex + x, topCenterIndex + x + 1);
                }
            }
        }

        this.setAttribute('a_position', new BufferAttribute(new Float32Array(vertices), 4));
        this.setAttribute('a_normal', new BufferAttribute(new Float32Array(normals), 3));
        this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    }
}