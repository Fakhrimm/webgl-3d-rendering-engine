import vertexShaderSource from "./vertex-shader.vert?raw";
import fragmentShaderSource from "./fragment-shader.frag?raw";
import vertexBasic from "./vertex-basic.vert?raw";
import fragmentBasic from "./fragment-basic.frag?raw";

export function loadShader(shaderName: string): string {
    switch (shaderName) {
        case "vertex":
            return vertexShaderSource
        case "fragment":
            return fragmentShaderSource
        case "vertex-basic":
            return vertexBasic
        case "fragment-basic":
            return fragmentBasic
        default:
            throw new Error("Invalid shader name");
    }
}