import { MaterialTypes } from "../Types/material-types";
import { TextureTypes } from "../Types/texture-types";
import {NodeTypes} from "../Types/node-types.ts";

export interface IModel {
    nodes: INode[];
    meshes: IMeshMap;
}

export interface INode {
    name: string;
    nodeType: NodeTypes;
    position: IVector3;
    scale: IVector3;
    rotation: IEuler;
    children: number[];
    mesh?: number;
}

export interface ISceneNode extends INode {

}

export interface IMeshNode extends INode {
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

export interface IMeshMap {
    [key: number]: IMesh;
}

export interface IBufferGeometry {
    isSmoothShading: boolean,
    inputPosition: number[],
    inputIndices: number[],
    inputTexcoord: number[],
}

export interface IMaterial {
    type: MaterialTypes;
}

export interface IBasicMaterial extends IMaterial {
    type: MaterialTypes.BASIC;
    u_diffuseColor: number[];
    u_ambientColor: number[];
    diffuseTextureType: TextureTypes;
}

export interface IPhongMaterial extends IMaterial {
    type: MaterialTypes.PHONG;
    u_diffuseColor: number[];
    u_ambientColor: number[];
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

export interface IParallaxMaterial extends IMaterial {
    type: MaterialTypes.PARALLAX;
    u_diffuseColor: number[];
    u_specularColor: number[];
    u_shininess: number;
    u_ka: number;
    u_kd: number;
    u_ks: number;
    diffTextureType: TextureTypes,
    specTextureType: TextureTypes,
    normalTextureType: TextureTypes,
    heightTextureType: TextureTypes,
    heightScale: number,
}

export interface IReflectionMaterial extends IMaterial {
    type: MaterialTypes.REFLECTION;
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

export interface IOrthographicCamera extends INode {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    zoom: number;
}

export interface IObliqueCamera extends INode {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    alpha: number;
    beta: number;
    zoom: number;
}

export interface IPerspectiveCamera extends INode {
    fov: number;
    near: number;
    far: number;
    aspect: number;
    zoom: number;
}
