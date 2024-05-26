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

export class Angel extends BufferGeometry {
    innerRadius: number;
    outerRadius: number;
    numOfSegments: number;
    phiDistance: number;
    depth: number;

    constructor(innerRadius = 120, outerRadius = 150, numOfSegments = 30, depth = 30) {
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
            
            pushRotatedVertex(vertices, outerX2, outerY2 + (outerRadius-innerRadius)*1.5, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerX, outerY + (outerRadius-innerRadius)*1.5, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX, innerY + (outerRadius-innerRadius)*1.5, depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX2, innerY2 + (outerRadius-innerRadius)*1.5, depth, 1, Math.PI/2);

            pushRotatedVertex(vertices, outerX2, outerY2 + (outerRadius-innerRadius)*1.5, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerX, outerY + (outerRadius-innerRadius)*1.5, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX, innerY + (outerRadius-innerRadius)*1.5, -depth, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerX2, innerY2 + (outerRadius-innerRadius)*1.5, -depth, 1, Math.PI/2);

            pushRotatedVertex(vertices, outerY2 - (outerRadius-innerRadius)*3, depth, outerX2, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerY - (outerRadius-innerRadius)*3, depth, outerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY - (outerRadius-innerRadius)*3, depth, innerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY2 - (outerRadius-innerRadius)*3, depth, innerX2, 1, Math.PI/2);

            pushRotatedVertex(vertices, outerY2 - (outerRadius-innerRadius)*3, -depth, outerX2, 1, Math.PI/2);
            pushRotatedVertex(vertices, outerY - (outerRadius-innerRadius)*3, -depth, outerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY - (outerRadius-innerRadius)*3, -depth, innerX, 1, Math.PI/2);
            pushRotatedVertex(vertices, innerY2 - (outerRadius-innerRadius)*3, -depth, innerX2, 1, Math.PI/2);

            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + outerY2, depth, outerX2, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + outerY, depth, outerX, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + innerY, depth, innerX, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + innerY2, depth, innerX2, 1, 3*Math.PI/4);

            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + outerY2, -depth, outerX2, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + outerY, -depth, outerX, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + innerY, -depth, innerX, 1, 3*Math.PI/4);
            pushRotatedVertex(vertices, (outerRadius-innerRadius)*2 + innerY2, -depth, innerX2, 1, 3*Math.PI/4);
        }

        for (let i = 0; i < numOfSegments; i++) {
            let a = i * 24;
            let b = a + 1;
            let c = a + 2;
            let d = a + 3;
            let e = a + 4;
            let f = a + 5;
            let g = a + 6;
            let h = a + 7;

            let j = a + 8;
            let k = a + 9;
            let l = a + 10;
            let m = a + 11;
            let n = a + 12;
            let o = a + 13;
            let p = a + 14;
            let q = a + 15;

            let r = a + 16;
            let s = a + 17;
            let t = a + 18;
            let u = a + 19;
            let v = a + 20;
            let w = a + 21;
            let x = a + 22;
            let y = a + 23;

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

            // front
            indices.push(l, k, j);
            indices.push(j, m, l);

            // back
            indices.push(p, q, n);
            indices.push(n, o, p);

            // top
            indices.push(o, n, j);
            indices.push(j, k, o);

            // bottom
            indices.push(p, l, m);
            indices.push(m, q, p);

            // front
            indices.push(t, s, r);
            indices.push(r, u, t);

            // srck
            indices.push(x, y, v);
            indices.push(v, w, x);

            // top
            indices.push(w, v, r);
            indices.push(r, s, w);

            // sottom
            indices.push(x, t, u);
            indices.push(u, y, x);

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