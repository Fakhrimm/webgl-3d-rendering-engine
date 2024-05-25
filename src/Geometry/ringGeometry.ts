import { BufferGeometry } from "./bufferGeometry";
import { BufferAttribute } from "./bufferAttribute";

// export class RingGeometry extends BufferGeometry {
//     innerRadius: number;
//     outerRadius: number;
//     thetaSegments: number;
//     phiSegments: number;

//     constructor(innerRadius = 0.5, outerRadius = 1, thetaSegments = 32, phiSegments = 1) {
//         super();
//         this.innerRadius = innerRadius;
//         this.outerRadius = outerRadius;
//         this.thetaSegments = thetaSegments;
//         this.phiSegments = phiSegments;

//         const vertices = [];
//         const indices = [];
//         const normals = [];
//         const texcoord = [];

//         for (let i = 0; i <= phiSegments; i++) {
//             const phiFraction = i / phiSegments;
//             const radius = innerRadius + phiFraction * (outerRadius - innerRadius);

//             for (let j = 0; j <= thetaSegments; j++) {
//                 const theta = (j / thetaSegments) * 2 * Math.PI;

//                 const x = radius * Math.cos(theta);
//                 const y = radius * Math.sin(theta);

//                 vertices.push(x, y, 0, 1);
//                 normals.push(0, 0, 1);

//                 const u = (x / outerRadius + 1) / 2;
//                 const v = (y / outerRadius + 1) / 2;
//                 texcoord.push(u, v);
//             }
//         }

//         for (let i = 0; i < phiSegments; i++) {
//             const thetaSegmentPlusOne = thetaSegments + 1;

//             for (let j = 0; j < thetaSegments; j++) {
//                 const a = i * thetaSegmentPlusOne + j;
//                 const b = a + thetaSegmentPlusOne;
//                 const c = b + 1;
//                 const d = a + 1;

//                 indices.push(a, b, d);
//                 indices.push(b, c, d);
//             }
//         }

//         this.setAttribute('a_position', new BufferAttribute(new Float32Array(vertices), 4));
//         this.setAttribute('a_normal', new BufferAttribute(new Float32Array(normals), 3));
//         this.setAttribute('a_texcoord', new BufferAttribute(new Float32Array(texcoord), 2));
//         this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
//     }

//     // static fromJSON(json: any): RingGeometry {
//     //     return new RingGeometry(json.width, json.height);
//     // }
//     //
//     // public toJSON(): object {
//     //     return {
//     //         ...super.toJSON(),
//     //         innerRadius: this.innerRadius,
//     //         outerRadius: this.outerRadius,
//     //         thetaSegments: this.thetaSegments,
//     //         phiSegments: this.phiSegments,
//     //     };
//     // }
// }

export class RingGeometry extends BufferGeometry {
    innerRadius: number;
    outerRadius: number;
    numOfSegments: number;
    phiDistance: number;
    depth: number;

    constructor(innerRadius = 200, outerRadius = 250, numOfSegments = 30, depth = 100) {
        super();
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.numOfSegments = numOfSegments;
        this.phiDistance = 2/numOfSegments;
        this.depth = depth;

        const vertices = [];
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
            
            vertices.push(outerX2, outerY2, depth, 1);
            vertices.push(outerX, outerY, depth, 1);
            vertices.push(innerX, innerY, depth, 1);
            vertices.push(innerX2, innerY2, depth, 1);

            vertices.push(outerX2, outerY2, -depth, 1);
            vertices.push(outerX, outerY, -depth, 1);
            vertices.push(innerX, innerY, -depth, 1);
            vertices.push(innerX2, innerY2, -depth, 1);
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
            indices.push(a, b, c);
            indices.push(c, d, a);

            // back
            indices.push(e, h, g);
            indices.push(g, f, e);

            // top
            indices.push(a, e, f);
            indices.push(f, b, a);

            // bottom
            indices.push(d, c, g);
            indices.push(g, h, d);

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

        // console.log("vertices", vertices);
        // console.log("indices", indices);

        this.setAllInputs(new Float32Array(vertices), new Uint16Array(indices), new Float32Array(texcoord));
    }
}