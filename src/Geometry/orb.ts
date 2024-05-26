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

export class Orb extends BufferGeometry {
    innerRadius: number;
    outerRadius: number;
    numOfSegments: number;
    phiDistance: number;
    depth: number;

    constructor(innerRadius = 200, outerRadius = 250, numOfSegments = 40, depth = 40) {
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

            let outerX_2 = (innerRadius - 10) * Math.cos(i * Math.PI * this.phiDistance);
            let outerY_2 = (innerRadius - 10) * Math.sin(i * Math.PI * this.phiDistance);
            let innerX_2 = (innerRadius - depth) * Math.cos(i * Math.PI * this.phiDistance);
            let innerY_2 = (innerRadius - depth) * Math.sin(i * Math.PI * this.phiDistance);

            let outerX2_2 = (innerRadius - 10) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let outerY2_2 = (innerRadius - 10) * Math.sin((i+1) * Math.PI * this.phiDistance);
            let innerX2_2 = (innerRadius - depth) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let innerY2_2 = (innerRadius - depth) * Math.sin((i+1) * Math.PI * this.phiDistance);

            let outer3 = outerRadius + depth;
            let inner3 = outerRadius + 10;
            let outerX_3 = (outer3) * Math.cos(i * Math.PI * this.phiDistance);
            let outerY_3 = (outer3) * Math.sin(i * Math.PI * this.phiDistance);
            let innerX_3 = (inner3) * Math.cos(i * Math.PI * this.phiDistance);
            let innerY_3 = (inner3) * Math.sin(i * Math.PI * this.phiDistance);

            let outerX2_3 = (outer3) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let outerY2_3 = (outer3) * Math.sin((i+1) * Math.PI * this.phiDistance);
            let innerX2_3 = (inner3) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let innerY2_3 = (inner3) * Math.sin((i+1) * Math.PI * this.phiDistance);

            let outer4 = outer3 + depth;
            let inner4 = outer3 + 10;
            let outerX_4 = (outer4) * Math.cos(i * Math.PI * this.phiDistance);
            let outerY_4 = (outer4) * Math.sin(i * Math.PI * this.phiDistance);
            let innerX_4 = (inner4) * Math.cos(i * Math.PI * this.phiDistance);
            let innerY_4 = (inner4) * Math.sin(i * Math.PI * this.phiDistance);

            let outerX2_4 = (outer4) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let outerY2_4 = (outer4) * Math.sin((i+1) * Math.PI * this.phiDistance);
            let innerX2_4 = (inner4) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let innerY2_4 = (inner4) * Math.sin((i+1) * Math.PI * this.phiDistance);

            let outer5 = outer4 + depth;
            let inner5 = outer4 + 10;
            let outerX_5 = (outer5) * Math.cos(i * Math.PI * this.phiDistance);
            let outerY_5 = (outer5) * Math.sin(i * Math.PI * this.phiDistance);
            let innerX_5 = (inner5) * Math.cos(i * Math.PI * this.phiDistance);
            let innerY_5 = (inner5) * Math.sin(i * Math.PI * this.phiDistance);

            let outerX2_5 = (outer5) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let outerY2_5 = (outer5) * Math.sin((i+1) * Math.PI * this.phiDistance);
            let innerX2_5 = (inner5) * Math.cos((i+1) * Math.PI * this.phiDistance);
            let innerY2_5 = (inner5) * Math.sin((i+1) * Math.PI * this.phiDistance);

            pushRotatedVertex(vertices, outerY2, depth, outerX2, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerY, depth, outerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY, depth, innerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY2, depth, innerX2, 1, Math.PI/2);

            pushRotatedVertex(vertices, outerY2, -depth, outerX2, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerY, -depth, outerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY, -depth, innerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY2, -depth, innerX2, 1, Math.PI/2);

            pushRotatedVertex(vertices, depth, outerY2_2, outerX2_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, depth, outerY_2, outerX_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, depth, innerY_2, innerX_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, depth, innerY2_2, innerX2_2, 1, 2*Math.PI/4);

            pushRotatedVertex(vertices, -depth, outerY2_2, outerX2_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, -depth, outerY_2, outerX_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, -depth, innerY_2, innerX_2, 1, 2*Math.PI/4);
            pushRotatedVertex(vertices, -depth, innerY2_2, innerX2_2, 1, 2*Math.PI/4);

            pushRotatedVertex(vertices, outerY2_3, depth, outerX2_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, outerY_3, depth, outerX_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, innerY_3, depth, innerX_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, innerY2_3, depth, innerX2_3, 1, 1*Math.PI/4);

            pushRotatedVertex(vertices, outerY2_3, -depth, outerX2_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, outerY_3, -depth, outerX_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, innerY_3, -depth, innerX_3, 1, 1*Math.PI/4);
            pushRotatedVertex(vertices, innerY2_3, -depth, innerX2_3, 1, 1*Math.PI/4);

            pushRotatedVertex(vertices, outerY2_4, depth, outerX2_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, outerY_4, depth, outerX_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, innerY_4, depth, innerX_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, innerY2_4, depth, innerX2_4, 1, 3*Math.PI/4);

            pushRotatedVertex(vertices, outerY2_4, -depth, outerX2_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, outerY_4, -depth, outerX_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, innerY_4, -depth, innerX_4, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, innerY2_4, -depth, innerX2_4, 1, 3*Math.PI/4);

            pushRotatedVertex(vertices, depth, outerY2_5, outerX2_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, depth, outerY_5, outerX_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, depth, innerY_5, innerX_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, depth, innerY2_5, innerX2_5, 1, 3*Math.PI/4);

            pushRotatedVertex(vertices, -depth, outerY2_5, outerX2_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, -depth, outerY_5, outerX_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, -depth, innerY_5, innerX_5, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, -depth, innerY2_5, innerX2_5, 1, 3*Math.PI/4);
        }

        let counter = 5;
        for (let i = 0; i < numOfSegments; i++) {
            for (let j = 0; j < counter; j++) {
                let index = i * counter*8 + j*8;
                let a = index;
                let b = index + 1;
                let c = index + 2;
                let d = index + 3;
                let e = index + 4;
                let f = index + 5;
                let g = index + 6;
                let h = index + 7;
                
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

        }

        this.setAllInputs(new Float32Array(vertices), new Uint16Array(indices), new Float32Array(texcoord));
    }
}