import "./style.css";
import { loadShader, ShaderType } from "./Shaders/shader-loader";
import { ProgramInfo } from "./WebGL/program-info";
import { WebGLRenderer } from "./WebGL/webgl-renderer";
import { Scene } from "./Object/scene.ts";

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
  // const vertexShaderSource = loadShader(ShaderType.VERTEX_REGULAR);
  const vertexShaderSource = loadShader(ShaderType.VERTEX_ADV);
  const fragmentShaderSource = loadShader(ShaderType.FRAGMENT_BASIC);

  // Create program info
  const programInfo = new ProgramInfo(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const webGLRenderer = new WebGLRenderer(canvas, programInfo);

  // Setup and render

  const sceneDummy = Scene.createSceneDummy(canvas);
  webGLRenderer.adjustCanvas();
  // webGLRenderer.render(sceneDummy)

    webGLRenderer.renderTest3();
};

main();
