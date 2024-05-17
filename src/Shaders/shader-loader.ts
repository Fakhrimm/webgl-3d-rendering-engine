import basicVertexShader from "./basic-vertex.vert?raw";
import basicFragmentShader from "./basic-fragment.frag?raw";
import phongVertexShader from "./phong-vertex.vert?raw";
import phongFragmentShader from "./phong-fragment.frag?raw";

export enum ShaderType {
    BASIC_VERTEX,
    BASIC_FRAGMENT,
    PHONG_VERTEX,
    PHONG_FRAGMENT
}



export function loadShader(shaderType: ShaderType): string {
    switch (shaderType) {
        case ShaderType.BASIC_VERTEX:
            return basicVertexShader
        case ShaderType.PHONG_VERTEX:
            return phongVertexShader
        case ShaderType.BASIC_FRAGMENT:
            return basicFragmentShader
        case ShaderType.PHONG_FRAGMENT:
            return phongFragmentShader
        default:
            throw new Error("ShaderType not implemented in loader");
    }
}