import {BufferGeometry} from "./bufferGeometry";

export class BoxGeometry extends BufferGeometry {
    width: number;
    height: number;
    depth: number;

    constructor(width=1, height=1, depth=1, isSmoothShading = false) {
        super(isSmoothShading);
        this.width = width;
        this.height = height;
        this.depth = depth;

        const hw = width / 2, hh = height / 2, hd = depth / 2;

        const vertices = new Float32Array([
            +hw, +hh, +hd, 1,
            -hw, +hh, +hd, 1,
            -hw, -hh, +hd, 1,
            +hw, -hh, +hd, 1,
            +hw, +hh, -hd, 1,
            -hw, +hh, -hd, 1,
            -hw, -hh, -hd, 1,
            +hw, -hh, -hd, 1,
        ]);

        const indices = new Uint16Array([
            // front
            0, 1, 2,
            2, 3, 0,
            // back
            4, 7, 6,
            6, 5, 4,
            // top
            0, 4, 5,
            5, 1, 0,
            // bottom
            3, 2, 6,
            6, 7, 3,
            // right
            0, 3, 7,
            7, 4, 0,
            // left
            1, 5, 6,
            6, 2, 1,
        ]);
        this.calculateAndSetAttributes(vertices, indices);
    }
}