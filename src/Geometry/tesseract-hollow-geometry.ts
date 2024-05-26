import { Vector3 } from "../Math/vector-3";
import {Box} from "lucide";
import {BoxGeometry} from "./boxGeometry.ts";
import {BufferGeometry} from "./bufferGeometry.ts";


function makeHollowCube(outMat: Vector3[][]) {
    const frontOutEdges: number[] = []
    frontOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[0][1], outMat[1][7]));
    frontOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[1][2], outMat[2][4]));
    frontOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[2][3], outMat[3][5]));
    frontOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[3][0], outMat[0][6]));

    const backOutEdges: number[] = []
    backOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[4][5], outMat[5][3]));
    backOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[5][6], outMat[6][0]));
    backOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[6][7], outMat[7][1]));
    backOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[7][5], outMat[4][3]));

    const sideOutEdges: number[] = []
    sideOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[0][0], outMat[4][6]));
    sideOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[1][1], outMat[5][7]));
    sideOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[2][2], outMat[6][4]));
    sideOutEdges.push(...BoxGeometry.getPositionBoxFromTwoPoints(outMat[3][3], outMat[7][5]));

    const result: number[] = []

    // result.push(...outCube)
    result.push(...frontOutEdges)
    result.push(...backOutEdges)
    result.push(...sideOutEdges)
    return result;
}

export function tesseractHollowGeometry(
    innerLength = 120,
    outerlength = 400,
    thickness = 30
) {

    const halfInner = innerLength / 2;
    const halfOuter = outerlength / 2;
    const halfThickness = thickness / 2;

    const outMat: Vector3[][] = [];
    for (let i = 0; i < 8; i++) {
        outMat[i] = [];
        for (let j = 0; j < 8; j++) {
            outMat[i][j] = doubleRef(i, j, halfOuter, halfThickness);
        }
    }
    console.log(outMat);

    const inMat: Vector3[][] = [];
    for (let i = 0; i < 8; i++) {
        inMat[i] = [];
        for (let j = 0; j < 8; j++) {
            inMat[i][j] = doubleRef(i, j, halfInner, halfThickness);
        }
    }

    const bigCube = makeHollowCube(outMat);
    const smallCube = makeHollowCube(inMat);

    const result: number[] = []
    result.push(...bigCube)
    result.push(...smallCube)

    return new BufferGeometry(false, new Float32Array(result));
}

function  ref(index :number, len: number) {
    switch (index) {
        case 0:
            return new Vector3(len, len, len);
        case 1:
            return new Vector3(-len, len, len);
        case 2:
            return new Vector3(-len, -len, len);
        case 3:
            return new Vector3(len, -len, len);
        case 4:
            return new Vector3(len, len, -len);
        case 5:
            return new Vector3(-len, len, -len);
        case 6:
            return new Vector3(-len, -len, -len);
        case 7:
            return new Vector3(len, -len, -len);
        default:
            throw new Error('index is out of range: ' + index);
    }
}
function doubleRef(indexBig :number, indexSmall: number,  lenBig: number, lenSmall: number) {
    return ref(indexBig, lenBig).add(ref(indexSmall, lenSmall));
}
