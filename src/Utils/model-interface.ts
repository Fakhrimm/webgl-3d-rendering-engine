import { MaterialTypes } from "../Types/material-types";
import { TextureTypes } from "../Types/texture-types";

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
    mesh?: number;
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
    material: IMaterial;
    animation: IAnimation;
}

export interface IBufferGeometry {
    isSmoothShading: boolean,
    inputPosition: Float32Array,
    inputIndices: Uint16Array,
    inputTexcoord: Float32Array,
}

export interface IMaterial {
    type: MaterialTypes;
}

export interface IBasicMaterial extends IMaterial {
    type: MaterialTypes.BASIC;
    u_diffuseColor: number[];
    diffuseTextureType: TextureTypes;
}

export interface IPhongMaterial extends IMaterial {
    type: MaterialTypes.PHONG;
    u_diffuseColor: number[];
    u_specularColor: number[];
    u_shininess: number;
    u_ka: number;
    u_kd: number;
    u_ks: number;
    diffTextureType: TextureTypes,
    specTextureType: TextureTypes,
    normalTextureType: TextureTypes,
    displacementTextureType: TextureTypes,
    displacementScale: number,
    displacementBias: number
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