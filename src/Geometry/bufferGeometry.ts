import { BufferAttribute } from "./bufferAttribute";
import { Vector3 } from "../Math/vector-3.ts";
import { Vector2 } from "../Math/vector-2.ts";
import { IBufferGeometry } from "../Utils/model-interface.ts";

export class BufferGeometry {
    private readonly _attributes: { [name: string]: BufferAttribute };
    private inputPosition!: Float32Array;
    private inputIndices!: Uint16Array;
    private inputTexcoord!: Float32Array;
    private _indices?: BufferAttribute;
    private isSmoothShading: boolean;

    constructor(
        isSmoothShading = false,
        inputPosition = new Float32Array(),
        inputIndices = new Uint16Array(),
        inputTexcoord = new Float32Array()
    ) {
        this._attributes = {};
        this.isSmoothShading = isSmoothShading;

        if (inputPosition.length > 0) {
            this.setAllInputs(inputPosition, inputIndices, inputTexcoord);
        }
    }

    protected setAllInputs(
        inputPosition: Float32Array,
        inputIndices: Uint16Array = new Uint16Array(),
        inputTexcoord: Float32Array = new Float32Array()
    ) {
        this.inputPosition = inputPosition;
        this.inputIndices = inputIndices;
        this.inputTexcoord = inputTexcoord;

        // If inputIndices is empty, we need to calculate inputIndices and adjust inputPosition
        if (inputIndices.length === 0) {
            this.calculateNewIndicesAndNewPosition();
        }

        // console.log("inputPosition", this.inputPosition)
        // console.log("inputIndices", this.inputIndices)
        this.calculateAndSetAttributes();

        if (inputTexcoord.length == 0) {
            this.calculateTexCoords();
        }

        this.setAttribute(
            "a_texcoord",
            new BufferAttribute(this.inputTexcoord, 2)
        );
        this.calculateAndSetTangents();

        // console.log("position", this.getAttribute("a_position"));
        // console.log("normal", this.getAttribute("a_normal"));
        // console.log("texcoord", this.getAttribute("a_texcoord"));
        // console.log("tangent", this.getAttribute("a_tangent"));
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

    getAttribute(name: string): BufferAttribute | null {
        return this._attributes[name];
    }

    setAttribute(name: string, attribute: BufferAttribute) {
        this._attributes[name] = attribute;
        return this;
    }
    setToSmoothShading() {
        this.isSmoothShading = true;
        this.calculateAndSetAttributes();
    }

    setToFlatShading() {
        this.isSmoothShading = false;
        this.calculateAndSetAttributes();
    }

    calculateAndSetAttributes() {
        const position = new Float32Array(4 * this.inputIndices.length);
        const normal = new Float32Array(3 * this.inputIndices.length);

        // Copy input to position
        for (let i = 0; i < this.inputIndices.length; i++) {
            const index = this.inputIndices[i];
            position[i * 4] = this.inputPosition[index * 4];
            position[i * 4 + 1] = this.inputPosition[index * 4 + 1];
            position[i * 4 + 2] = this.inputPosition[index * 4 + 2];
            position[i * 4 + 3] = this.inputPosition[index * 4 + 3];
        }

        if (!this.isSmoothShading) {
            // Calculate face normals
            for (let i = 0; i < this.inputIndices.length; i += 3) {
                const i1 = this.inputIndices[i] * 4;
                const i2 = this.inputIndices[i + 1] * 4;
                const i3 = this.inputIndices[i + 2] * 4;

                const v1 = new Vector3(
                    this.inputPosition[i1],
                    this.inputPosition[i1 + 1],
                    this.inputPosition[i1 + 2]
                );
                const v2 = new Vector3(
                    this.inputPosition[i2],
                    this.inputPosition[i2 + 1],
                    this.inputPosition[i2 + 2]
                );
                const v3 = new Vector3(
                    this.inputPosition[i3],
                    this.inputPosition[i3 + 1],
                    this.inputPosition[i3 + 2]
                );

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
            const vertexNormals: Vector3[] = new Array(
                this.inputPosition.length / 4
            );
            for (let i = 0; i < vertexNormals.length; i++) {
                vertexNormals[i] = new Vector3(0, 0, 0);
            }
            const vertexFaces: number[] = new Array(
                this.inputPosition.length / 4
            ).fill(0);

            for (let i = 0; i < this.inputIndices.length; i += 3) {
                const i1 = this.inputIndices[i];
                const i2 = this.inputIndices[i + 1];
                const i3 = this.inputIndices[i + 2];

                const v1 = new Vector3(
                    this.inputPosition[i1 * 4],
                    this.inputPosition[i1 * 4 + 1],
                    this.inputPosition[i1 * 4 + 2]
                );
                const v2 = new Vector3(
                    this.inputPosition[i2 * 4],
                    this.inputPosition[i2 * 4 + 1],
                    this.inputPosition[i2 * 4 + 2]
                );
                const v3 = new Vector3(
                    this.inputPosition[i3 * 4],
                    this.inputPosition[i3 * 4 + 1],
                    this.inputPosition[i3 * 4 + 2]
                );

                const n = v2.clone().sub(v1).cross(v3.clone().sub(v1));

                // Uncomment the following line if you want unweighted area normals
                // n.normalize();

                const angle1 = v2.clone().sub(v1).angleTo(v3.clone().sub(v1));
                const angle2 = v3.clone().sub(v2).angleTo(v1.clone().sub(v2));
                const angle3 = v1.clone().sub(v3).angleTo(v2.clone().sub(v3));

                const res1 = n.clone().multiplyScalar(angle1);
                const res2 = n.clone().multiplyScalar(angle2);
                const res3 = n.clone().multiplyScalar(angle3);

                vertexNormals[i1].add(res1);
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

            for (let i = 0; i < this.inputIndices.length; i++) {
                const index = this.inputIndices[i];
                normal[i * 3] = vertexNormals[index].x;
                normal[i * 3 + 1] = vertexNormals[index].y;
                normal[i * 3 + 2] = vertexNormals[index].z;
            }
        }
        this.setAttribute("a_position", new BufferAttribute(position, 4));
        this.setAttribute("a_normal", new BufferAttribute(normal, 3));
    }

    calculateTexCoords() {
        const texcoord = new Float32Array(2 * this.inputIndices.length);
        // Copy input to texcoord
        for (let i = 0; i < this.inputIndices.length; i += 3) {
            const i1 = i * 2;
            texcoord[i1] = 0;
            texcoord[i1 + 1] = 0;
            texcoord[i1 + 2] = 1;
            texcoord[i1 + 3] = 0;
            texcoord[i1 + 4] = 1;
            texcoord[i1 + 5] = 1;
        }
        this.inputTexcoord = texcoord;
    }
    calculateAndSetTangents() {
        // https://learnopengl.com/Advanced-Lighting/Normal-Mapping
        const positionAttr = this.getAttribute("a_position");
        const normalAttr = this.getAttribute("a_normal");
        const texcoordAttr = this.getAttribute("a_texcoord");

        // console.log(positionAttr, normalAttr, texcoordAttr)
        if (!positionAttr || !normalAttr || !texcoordAttr) {
            throw new Error("Missing attributes");
        }
        const position = positionAttr.data as Float32Array;
        const texcoord = texcoordAttr.data as Float32Array;

        const tangent = new Float32Array((3 * position.length) / 4);
        for (let i = 0; i < position.length / 4; i += 3) {
            const p1 = new Vector3(
                position[i * 4],
                position[i * 4 + 1],
                position[i * 4 + 2]
            );
            const p2 = new Vector3(
                position[(i + 1) * 4],
                position[(i + 1) * 4 + 1],
                position[(i + 1) * 4 + 2]
            );
            const p3 = new Vector3(
                position[(i + 2) * 4],
                position[(i + 2) * 4 + 1],
                position[(i + 2) * 4 + 2]
            );

            const e1 = p2.clone().sub(p1);
            const e2 = p3.clone().sub(p1);

            const uv1 = new Vector2(texcoord[i * 2], texcoord[i * 2 + 1]);
            const uv2 = new Vector2(
                texcoord[(i + 1) * 2],
                texcoord[(i + 1) * 2 + 1]
            );
            const uv3 = new Vector2(
                texcoord[(i + 2) * 2],
                texcoord[(i + 2) * 2 + 1]
            );

            const deltaUV1 = uv2.clone().sub(uv1);
            const deltaUV2 = uv3.clone().sub(uv1);

            const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);

            for (let j = 0; j < 3; j++) {
                tangent[(i + j) * 3] =
                    f * (deltaUV2.y * e1.x - deltaUV1.y * e2.x);
                tangent[(i + j) * 3 + 1] =
                    f * (deltaUV2.y * e1.y - deltaUV1.y * e2.y);
                tangent[(i + j) * 3 + 2] =
                    f * (deltaUV2.y * e1.z - deltaUV1.y * e2.z);
            }
        }
        this.setAttribute("a_tangent", new BufferAttribute(tangent, 3));
    }

    private calculateNewIndicesAndNewPosition() {
        const newPosition = [];
        const newIndices = [];
        let currentIndex = 0;
        const indexMap = new Map<string, number>();

        for (let i = 0; i < this.inputPosition.length; i += 4) {
            const positionString = `${this.inputPosition[i]},${
                this.inputPosition[i + 1]
            },${this.inputPosition[i + 2]},${this.inputPosition[i + 3]}`;
            const result = indexMap.get(positionString);

            if (result === undefined) {
                indexMap.set(positionString, currentIndex);
                newPosition.push(this.inputPosition[i]);
                newPosition.push(this.inputPosition[i + 1]);
                newPosition.push(this.inputPosition[i + 2]);
                newPosition.push(this.inputPosition[i + 3]);
                newIndices.push(currentIndex);
                currentIndex++;
            } else {
                newIndices.push(result);
            }
        }
        this.inputPosition = new Float32Array(newPosition);
        this.inputIndices = new Uint16Array(newIndices);
    }

    public toRaw(): IBufferGeometry {
        return {
            isSmoothShading: this.isSmoothShading,
            inputPosition: this.inputPosition,
            inputIndices: this.inputIndices,
            inputTexcoord: this.inputTexcoord,
        };
    }

    public static fromRaw(raw: IBufferGeometry): BufferGeometry {
        const geometry = new BufferGeometry(
            raw.isSmoothShading,
            new Float32Array(Object.values(raw.inputPosition)),
            new Uint16Array(Object.values(raw.inputIndices)),
            new Float32Array(Object.values(raw.inputTexcoord))
        );
        return geometry;
    }
}
