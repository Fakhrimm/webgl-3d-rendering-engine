import { BufferAttribute } from "../Geometry/bufferAttribute";

export type UniformSetters = {
    [UniformName: string]:
        | ((v: Iterable<number>) => void)
        | ((v: number) => void);
}

export type AttributeSingleDataType = BufferAttribute | Float32Array | number[];
export type AttributeDataType = [AttributeSingleDataType] | number[];
export type AttributeSetters = (...v: AttributeDataType) => void;
export type AttributeMapSetters = {[key: string]: AttributeSetters};