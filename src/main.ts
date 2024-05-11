import "./style.css";
import { ProgramInfo } from "./Webgl/program-info";
import { loadShader, ShaderType } from "./Shaders/shader-loader";
import { WebGLRenderer } from "./Webgl/webgl-renderer";

const main = async () => {
  // Get Canvas and WebGL context
  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    );
    return;
  }

  // Load shaders
  const vertexShaderSource = loadShader(ShaderType.VERTEX_REGULAR);
  const fragmentShaderSource = loadShader(ShaderType.FRAGMENT_BASIC);

  // Create program info
  const programInfo = new ProgramInfo(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const webGLRenderer = new WebGLRenderer(canvas, programInfo);

  // Setup and render
  webGLRenderer.adjustCanvas();
  webGLRenderer.render();
};

main();
