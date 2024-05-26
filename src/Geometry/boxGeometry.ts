import {BufferGeometry} from "./bufferGeometry";
import {Vector3} from "../Math/vector-3.ts";
import {Matrix4} from "../Math/matrix-4.ts";
import {Quaternion} from "../Math/quaternion.ts";

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
            +hw, +hh, +hd, 1, // a
            -hw, +hh, +hd, 1,
            -hw, -hh, +hd, 1,
            +hw, -hh, +hd, 1,
            +hw, +hh, -hd, 1, // e
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

        const texcoord = new Float32Array([
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
            // right
            1, 1,  1,0,  0, 0,
            0, 0,  0, 1,  1, 1,
            // left
            1, 1,  1,0,  0, 0,
            0, 0,  0, 1,  1, 1,
        ]);
        this.setAllInputs(vertices, indices, texcoord);
    }

    public static getPositionBoxFromTwoPoints(p1: Vector3, p2: Vector3, isSmoothShading = false) {
        const width = Math.abs(p2.x - p1.x);
        const height = Math.abs(p2.y - p1.y);
        const depth = Math.abs(p2.z - p1.z);
        const box = new BoxGeometry(width, height, depth, isSmoothShading);
        const boxInputPosition = box.getAttribute('a_position')!.data;
        const listOfVertices: Vector3[] = []
        for (let i = 0; i < boxInputPosition.length; i+=4) {
            listOfVertices.push(new Vector3(boxInputPosition[i], boxInputPosition[i+1], boxInputPosition[i+2]))
        }

        const position = new Vector3((p2.x + p1.x) / 2, (p2.y + p1.y) / 2, (p2.z + p1.z) / 2)
        const quaternion = new Quaternion()
        const scale = new Vector3(1, 1, 1);

        const transformationMatrix = new Matrix4().compose(position, quaternion, scale)

        for (let i = 0; i < listOfVertices.length; i++) {
            listOfVertices[i].applyMatrix4(transformationMatrix)
        }

        const newPosition: number[] = []

        for (let i = 0; i < listOfVertices.length; i++) {
            newPosition.push(listOfVertices[i].x)
            newPosition.push(listOfVertices[i].y)
            newPosition.push(listOfVertices[i].z)
            newPosition.push(1)
        }

        return newPosition
    }
}