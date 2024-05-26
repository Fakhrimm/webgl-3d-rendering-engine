import { BufferGeometry } from "./bufferGeometry";

function rotateVertex(vertex: any, theta: any) {
    const matrix = [
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    ];

    const x = vertex[0];
    const y = vertex[1];
    const z = vertex[2];
    const w = vertex[3];

    return [
        matrix[0] * x + matrix[1] * y + matrix[2] * z + matrix[3] * w,
        matrix[4] * x + matrix[5] * y + matrix[6] * z + matrix[7] * w,
        matrix[8] * x + matrix[9] * y + matrix[10] * z + matrix[11] * w,
        matrix[12] * x + matrix[13] * y + matrix[14] * z + matrix[15] * w
    ];
}

function pushRotatedVertex(vertices: any, x: any, y: any, z: any, w: any, theta: any) {
    const rotatedVertex = rotateVertex([x, y, z, w], theta);
    vertices.push(...rotatedVertex);
}

export class PipeHollow extends BufferGeometry {
    innerRadius: number;
    outerRadius: number;
    numOfSegments: number;
    phiDistance: number;
    depth: number;

    constructor(innerRadius = 120, outerRadius = 150, numOfSegments = 30, depth = 200) {
        super();
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.numOfSegments = numOfSegments;
        this.phiDistance = 2/numOfSegments;
        this.depth = depth;

        const vertices: Iterable<number> = [];
        const indices = [];
        const texcoord = [];

        for (let i = 0; i < numOfSegments; i++) {
            let outerX = outerRadius * Math.cos(i * Math.PI * this.phiDistance);
            let outerY = outerRadius * Math.sin(i * Math.PI * this.phiDistance);
            let innerX = innerRadius * Math.cos(i * Math.PI * this.phiDistance);
            let innerY = innerRadius * Math.sin(i * Math.PI * this.phiDistance);

            let outerX2 = outerRadius * Math.cos((i+1) * Math.PI * this.phiDistance);
            let outerY2 = outerRadius * Math.sin((i+1) * Math.PI * this.phiDistance);
            let innerX2 = innerRadius * Math.cos((i+1) * Math.PI * this.phiDistance);
            let innerY2 = innerRadius * Math.sin((i+1) * Math.PI * this.phiDistance);
            
            pushRotatedVertex(vertices, outerX2, outerY2, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerX, outerY, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX, innerY, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX2, innerY2, depth, 1, Math.PI/2);

            pushRotatedVertex(vertices, outerX2, outerY2, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerX, outerY, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX, innerY, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX2, innerY2, -depth, 1, Math.PI/2);
        }

        for (let i = 0; i < numOfSegments; i++) {
            let a = i * 8;
            let b = a + 1;
            let c = a + 2;
            let d = a + 3;
            let e = a + 4;
            let f = a + 5;
            let g = a + 6;
            let h = a + 7;

            // front
            indices.push(c, b, a);
            indices.push(a, d, c);

            // back
            indices.push(g, h, e);
            indices.push(e, f, g);

            // top
            indices.push(f, e, a);
            indices.push(a, b, f);

            // bottom
            indices.push(g, c, d);
            indices.push(d, h, g);

            texcoord.push(
                // front
                1, 1,  1,0,  0, 0,
                0, 0,  0, 1,  1, 1,
                // back
                1, 1,  1,0,  0, 0,
                0, 0,  0, 1,  1, 1,
                // top
                1, 1,  1,0,  0, 0,
                0, 0,  0, 1,  1, 1,
                // bottom
                1, 1,  1,0,  0, 0,
                0, 0,  0, 1,  1, 1,
            );
        }

        this.setAllInputs(new Float32Array(vertices), new Uint16Array(indices), new Float32Array(texcoord));
    }
}