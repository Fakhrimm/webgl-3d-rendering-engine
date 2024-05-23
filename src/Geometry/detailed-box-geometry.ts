import {BufferGeometry} from "./bufferGeometry.ts";

export class DetailedBoxGeometry extends BufferGeometry {

    constructor(width: number, height: number, depth: number, segmentCount: number = 1) {
        super();
        vertices = new  Float32Array(8 * 3 * segmentCount * segmentCount * segmentCount);

        const hw = width / 2;
        const hh = height / 2;
        const hd = depth / 2;

        const x = [];
        const y = [];
        const z = [];

        for (let i = 0; i < segmentCount; i++) {
            x.push(-hw + i * width / segmentCount);
            y.push(-hh + i * height / segmentCount);
            z.push(-hd + i * depth / segmentCount);
        }
    }
}