import { BufferGeometry } from "./bufferGeometry";
import { BufferAttribute } from "./bufferAttribute";

export class RingGeometry extends BufferGeometry {
    innerRadius: number;
    outerRadius: number;
    thetaSegments: number;
    phiSegments: number;

    constructor(innerRadius = 0.5, outerRadius = 1, thetaSegments = 32, phiSegments = 1) {
        super();
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.thetaSegments = thetaSegments;
        this.phiSegments = phiSegments;

        const vertices = [];
        const indices = [];
        const normals = [];

        for (let i = 0; i <= phiSegments; i++) {
            const phiFraction = i / phiSegments;
            const radius = innerRadius + phiFraction * (outerRadius - innerRadius);

            for (let j = 0; j <= thetaSegments; j++) {
                const theta = (j / thetaSegments) * 2 * Math.PI;

                const x = radius * Math.cos(theta);
                const y = radius * Math.sin(theta);

                vertices.push(x, y, 0, 1);
                normals.push(0, 0, 1);
            }
        }

        for (let i = 0; i < phiSegments; i++) {
            const thetaSegmentPlusOne = thetaSegments + 1;

            for (let j = 0; j < thetaSegments; j++) {
                const a = i * thetaSegmentPlusOne + j;
                const b = a + thetaSegmentPlusOne;
                const c = b + 1;
                const d = a + 1;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        this.setAttribute('a_position', new BufferAttribute(new Float32Array(vertices), 4));
        this.setAttribute('a_normal', new BufferAttribute(new Float32Array(normals), 3));
        this.setIndices(new BufferAttribute(new Uint16Array(indices), 1));
    }
}