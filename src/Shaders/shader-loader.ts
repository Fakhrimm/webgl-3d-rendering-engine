import basicVertexShader from "./basic-vertex.vert?raw";
import basicFragmentShader from "./basic-fragment.frag?raw";
import phongVertexShader from "./phong-vertex.vert?raw";
import phongFragmentShader from "./phong-fragment.frag?raw";
import parallaxVertexShader from "./parallax-vertex.vert?raw";
import parallaxFragmentShader from "./parallax-fragment.frag?raw";
import reflectionFragmentShader from "./reflection-fragment.frag?raw";
import reflectionVertexShader from "./reflection-vertex.vert?raw";

export enum ShaderType {
    BASIC_VERTEX,
    BASIC_FRAGMENT,
    PHONG_VERTEX,
    PHONG_FRAGMENT,
    PARALLAX_VERTEX,
    PARALLAX_FRAGMENT,
    REFLECTION_VERTEX,
    REFLECTION_FRAGMENT
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
        case ShaderType.PARALLAX_VERTEX:
            return parallaxVertexShader
        case ShaderType.PARALLAX_FRAGMENT:
            return parallaxFragmentShader
        case ShaderType.REFLECTION_FRAGMENT:
            return reflectionFragmentShader
        case ShaderType.REFLECTION_VERTEX:
            return reflectionVertexShader
        default:
            throw new Error("ShaderType not implemented in loader");
    }
}