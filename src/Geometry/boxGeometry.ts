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
            -hw, -hh,  hd, 1.0,  hw, -hh,  hd, 1.0,  hw,  hh,  hd, 1.0,
            -hw, -hh,  hd, 1.0,  hw,  hh,  hd, 1.0, -hw,  hh,  hd, 1.0,
            // Back face
            hw, -hh, -hd, 1.0, -hw, -hh, -hd, 1.0, -hw,  hh, -hd, 1.0,
            hw, -hh, -hd, 1.0, -hw,  hh, -hd, 1.0,  hw,  hh, -hd, 1.0,
            // Top face
            hw,  hh, hd, 1.0,  hw,  hh, -hd, 1.0,  -hw,  hh,  -hd, 1.0,
            -hw, hh, -hd, 1.0,  -hw,  hh,  +hd, 1.0, +hw,  hh, +hd, 1.0,
            // Bottom face
            hw, -hh,  hd, 1.0,  -hw, -hh,  +hd, 1.0, -hw, -hh, -hd, 1.0,
            -hw, -hh,  -hd, 1.0,  hw, -hh, -hd, 1.0, hw, -hh, hd, 1.0,
            // Right face
            hw, -hh,  hd, 1.0,  hw, -hh, -hd, 1.0,  hw,  hh, -hd, 1.0,
            hw, -hh,  hd, 1.0,  hw,  hh, -hd, 1.0,  hw,  hh,  hd, 1.0,
            // Left face
            -hw, -hh, -hd, 1.0, -hw, -hh,  hd, 1.0, -hw,  hh,  hd, 1.0,
            -hw, -hh, -hd, 1.0, -hw,  hh,  hd, 1.0, -hw,  hh, -hd, 1.0
        ]);

        // Normals for each face
        const normals = new Float32Array([
            // Front
            0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,
            // Back
            0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,
            // Top
            0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,
            // Bottom
            0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,
            // Right
            1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,
            // Left
            -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0
        ]);

        // Texture coordinates for each vertex
        const texCoords = new Float32Array([
            0, 0,  1, 0,  1, 1,  0, 0,  1, 1,  0, 1,  // Front
            1, 0,  0, 0,  0, 1,  1, 0,  0, 1,  1, 1,  // Back
            0, 1,  1, 1,  1, 0,  0, 1,  1, 0,  0, 0,  // Top
            0, 0,  1, 0,  1, 1,  0, 0,  1, 1,  0, 1,  // Bottom
            1, 0,  0, 0,  0, 1,  1, 0,  0, 1,  1, 1,  // Right
            0, 0,  1, 0,  1, 1,  0, 0,  1, 1,  0, 1   // Left
        ]);

        this.setAttribute('a_position', new BufferAttribute(vertices, 4));
        this.setAttribute('a_texcoord', new BufferAttribute(texCoords, 2));
        this.setAttribute('a_normal', new BufferAttribute(normals, 3));

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