import { BufferAttribute } from "./bufferAttribute";
import { BufferGeometry } from "./bufferGeometry";

export class BoxGeometry extends BufferGeometry {
    width: number;
    height: number;
    depth: number;

    constructor(width=1, height=1, depth=1) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;

        const hw = width / 2, hh = height / 2, hd = depth / 2;

        const vertices = new Float32Array([
            // Front face
            -hw, -hh,  hd, 1,
             hw, -hh,  hd, 1,
             hw,  hh,  hd, 1,
            -hw,  hh,  hd, 1,
            // Back face
            -hw, -hh, -hd, 1,
             hw, -hh, -hd, 1,
             hw,  hh, -hd, 1,
            -hw,  hh, -hd, 1
        ]);

        const indices = new Uint16Array([
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            3, 2, 6, 3, 6, 7,
            // Bottom face
            0, 1, 5, 0, 5, 4,
            // Right face
            1, 2, 6, 1, 6, 5,
            // Left face
            0, 3, 7, 0, 7, 4
        ]);

        const texcoord = new Float32Array([
            // Front face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            // Back face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            // Top face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            // Bottom face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            // Right face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]);

        this.setAttribute('a_position', new BufferAttribute(vertices, 4));
        this.setIndices(new BufferAttribute(indices, 6));
        this.setAttribute('a_texcoord', new BufferAttribute(texcoord, 2));

        this.calculateNormals();
    }

    static fromJSON(json: any): BoxGeometry {
        return new BoxGeometry(json.width, json.height, json.depth);
    }

    public toJSON(): object {
        return {
            ...super.toJSON(),
            a_width: this.width,
            a_height: this.height,
            a_depth: this.depth,
        };
    }
}