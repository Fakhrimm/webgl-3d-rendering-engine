import vertexBasic from "./basic-vertex.vert?raw";
import vertexShaderSource from "./vertex-shader.vert?raw";
import vertexShaderAdv from "./vertex-adv.vert?raw";
import fragmentBasic from "./basic-fragment.frag?raw";
import fragmentShaderSource from "./fragment-shader.frag?raw";
import fragmentShaderAdv from "./fragment-adv.frag?raw";

export enum ShaderType {
    VERTEX_BASIC,
    VERTEX_REGULAR,
    VERTEX_ADV,
    FRAGMENT_BASIC,
    FRAGMENT_REGULAR,
    FRAGMENT_ADV
}



export function loadShader(shaderType: ShaderType): string {
    switch (shaderType) {
        case ShaderType.VERTEX_BASIC:
            return vertexBasic
        case ShaderType.VERTEX_REGULAR:
            return vertexShaderSource
        case ShaderType.VERTEX_ADV:
            return vertexShaderAdv
        case ShaderType.FRAGMENT_BASIC:
            return fragmentBasic
        case ShaderType.FRAGMENT_REGULAR:
            return fragmentShaderSource
        case ShaderType.FRAGMENT_ADV:
            return fragmentShaderAdv
        default:
            throw new Error("ShaderType not implemented in loader");
    }
}