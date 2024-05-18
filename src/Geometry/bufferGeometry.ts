import { BufferAttribute } from './bufferAttribute'
import {Vector3} from "../Math/vector-3.ts";

export class BufferGeometry {
    private _attributes: {[name: string]: BufferAttribute};
    private inputPosition?: Float32Array;
    private inputIndices?: Uint16Array;
    private _indices?: BufferAttribute;
    private isSmoothShading: boolean;

    constructor(isSmoothShading = false) {
        this._attributes = {};
        this.isSmoothShading = isSmoothShading;
    }

    get attributes() {
        return this._attributes;
    }


    get indices() {
        return this._indices;
    }

    setIndices(indices: BufferAttribute) {
        this._indices = indices;
        return this;
    }

    setAttribute(name: string, attribute: BufferAttribute) {
        this._attributes[name] = attribute;
        return this;
    }
    setToSmoothShading() {
        this.isSmoothShading = true;
        this.calculateAndSetAttributes(this.inputPosition!, this.inputIndices!);
    }

    setToFlatShading() {
        this.isSmoothShading = false;
        this.calculateAndSetAttributes(this.inputPosition!, this.inputIndices!);
    }

    calculateAndSetAttributes(inputPosition: Float32Array, inputIndices: Uint16Array) {
        this.inputPosition = inputPosition;
        this.inputIndices = inputIndices;

        const position = new Float32Array(4 * inputIndices.length);
        const normal = new Float32Array(3 * inputIndices.length);
        const texcoord = new Float32Array(2 * inputIndices.length);

        // Copy input to position
        for (let i = 0; i < inputIndices.length; i++) {
            const index = inputIndices[i];
            position[i * 4] = inputPosition[index * 4];
            position[i * 4 + 1] = inputPosition[index * 4 + 1];
            position[i * 4 + 2] = inputPosition[index * 4 + 2];
            position[i * 4 + 3] = inputPosition[index * 4 + 3];
        }

        // Copy input to texcoord
        for (let i = 0; i < inputIndices.length; i += 3) {
            const i1 = inputIndices[i] * 2;
            const i2 = inputIndices[i + 1] * 2;
            const i3 = inputIndices[i + 2] * 2;

            texcoord[i1] = 0;
            texcoord[i1 + 1] = 0;
            texcoord[i2] = 1;
            texcoord[i2 + 1] = 0;
            texcoord[i3] = 1;
            texcoord[i3 + 1] = 1;
        }

        if (!this.isSmoothShading) {
            // Calculate face normals
            for (let i = 0; i < inputIndices.length; i += 3) {
                const i1 = inputIndices[i] * 4;
                const i2 = inputIndices[i + 1] * 4;
                const i3 = inputIndices[i + 2] * 4;

                const v1 = new Vector3(inputPosition[i1], inputPosition[i1 + 1], inputPosition[i1 + 2]);
                const v2 = new Vector3(inputPosition[i2], inputPosition[i2 + 1], inputPosition[i2 + 2]);
                const v3 = new Vector3(inputPosition[i3], inputPosition[i3 + 1], inputPosition[i3 + 2]);

                const n = v2.clone().sub(v1).cross(v3.clone().sub(v1));

                n.normalize();

                for (let j = 0; j < 3; j++) {
                    normal[3 * i + 3 * j] = n.x;
                    normal[3 * i + 3 * j + 1] = n.y;
                    normal[3 * i + 3 * j + 2] = n.z;
                }
            }
        } else {
            // https://stackoverflow.com/questions/45477806/general-method-for-calculating-smooth-vertex-normals-with-100-smoothness
            // Calculate vertex normals
            const vertexNormals: Vector3[] = new Array(inputPosition.length / 4)
            for (let i = 0; i < vertexNormals.length; i++) {
                vertexNormals[i] = new Vector3(0, 0, 0);
            }
            const vertexFaces: number[] = new Array(inputPosition.length / 4).fill(0);

            for (let i = 0; i < inputIndices.length; i += 3) {

                const i1 = inputIndices[i];
                const i2 = inputIndices[i + 1];
                const i3 = inputIndices[i + 2];

                const v1 = new Vector3(inputPosition[i1 * 4], inputPosition[i1 * 4 + 1], inputPosition[i1 * 4 + 2]);
                const v2 = new Vector3(inputPosition[i2 * 4], inputPosition[i2 * 4 + 1], inputPosition[i2 * 4 + 2]);
                const v3 = new Vector3(inputPosition[i3 * 4], inputPosition[i3 * 4 + 1], inputPosition[i3 * 4 + 2]);

                const n = v2.clone().sub(v1).cross(v3.clone().sub(v1));
                n.normalize();

                const angle1 = v2.clone().sub(v1).angleTo(v3.clone().sub(v1));
                const angle2 = v3.clone().sub(v2).angleTo(v1.clone().sub(v2));
                const angle3 = v1.clone().sub(v3).angleTo(v2.clone().sub(v3));

                const res1 = n.clone().multiplyScalar(angle1)
                const res2 = n.clone().multiplyScalar(angle2)
                const res3 = n.clone().multiplyScalar(angle3)

                vertexNormals[i1].add(res1)
                vertexNormals[i2].add(res2);
                vertexNormals[i3].add(res3);

                vertexFaces[i1]++;
                vertexFaces[i2]++;
                vertexFaces[i3]++;
            }

            for (let i = 0; i < vertexNormals.length; i++) {
                if (vertexFaces[i] === 0) {
                    continue;
                }
                vertexNormals[i].divideScalar(vertexFaces[i]);
                vertexNormals[i].normalize();
            }

            for (let i = 0; i < inputIndices.length; i++) {
                const index = inputIndices[i];
                normal[i * 3] = vertexNormals[index].x;
                normal[i * 3 + 1] = vertexNormals[index].y;
                normal[i * 3 + 2] = vertexNormals[index].z;
            }
        }

        this.setAttribute('a_position', new BufferAttribute(position, 4))
        this.setAttribute('a_normal', new BufferAttribute(normal, 3));
        this.setAttribute('a_texcoord', new BufferAttribute(texcoord, 2));
    }

    toJSON() {
        return {
            isSmoothShading: this.isSmoothShading,
            inputPosition: this.inputPosition!,
            inputIndices: this.inputIndices!,
        }
    }
}
