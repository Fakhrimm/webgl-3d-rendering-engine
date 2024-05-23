import { MaterialTypes } from "../Types/material-types";

export interface IModel {
    nodes: INode[];
    meshes: IMesh[];
}

export interface INode {
    name: string;
    position: IVector3;
    scale: IVector3;
    rotation: IEuler;
    children: number[];
}

export interface IMeshNode extends INode {
    mesh: number;
}

interface IVector3 {
    x: number;
    y: number;
    z: number;
}

interface IEuler {
    x: number;
    y: number;
    z: number;
}

export interface IMesh {
    geometry: IBufferGeometry;
    material: MaterialTypes;
    animation: IAnimation;
}

export interface IBufferGeometry {
    isSmoothShading: boolean,
    inputPosition: Float32Array,
    inputIndices: Uint16Array,
    inputTexcoord: Float32Array,
}

export interface IAnimation {
    name: string,
    frames: IFrame[];
}

export interface IFrame {
    keyframe: IKeyframe;
}

interface IKeyframe {
    rotation: number[]
}