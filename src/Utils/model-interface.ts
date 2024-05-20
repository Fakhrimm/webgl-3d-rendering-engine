export interface INodes {
    nodes: INode[];
}

export interface INode {
    name: string;
    position: IVector3;
    scale: IVector3;
    rotation: IEuler;
    localMatrix: number[];
    worldMatrix: number[];
    children: number[];
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