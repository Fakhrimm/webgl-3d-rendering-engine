import vertexShaderSource from "./vertex-shader.vert?raw";
import fragmentShaderSource from "./fragment-shader.frag?raw";
import vertexBasic from "./vertex-basic.vert?raw";
import fragmentBasic from "./fragment-basic.frag?raw";

export enum ShaderType {
    VERTEX_BASIC,
    VERTEX_REGULAR,
    FRAGMENT_BASIC,
    FRAGMENT_REGULAR
}



export function loadShader(shaderType: ShaderType): string {
    switch (shaderType) {
        case ShaderType.VERTEX_BASIC:
            return vertexBasic
        case ShaderType.FRAGMENT_BASIC:
            return fragmentBasic
        case ShaderType.VERTEX_REGULAR:
            return vertexShaderSource
        case ShaderType.FRAGMENT_REGULAR:
            return fragmentShaderSource
        default:
            throw new Error("ShaderType not implemented in loader");
    }
}