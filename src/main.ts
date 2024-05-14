import "./style.css";
import { loadShader, ShaderType } from "./Shaders/shader-loader";
import { ProgramInfo } from "./WebGL/program-info.ts";
import { WebGLRenderer } from "./WebGL/webgl-renderer";
import { Scene } from "./Object/scene.ts";
import { Container } from "./utils/Container.ts";
import { Variables } from "./utils/Variables.ts";
import { Render } from "./utils/Render.ts";
import { elementListner } from "./utils/ElementListener.ts";

const main = async () => {
  // Get Canvas and WebGL context
  const container = new Container();
  const canvas = container.getElement("canvas") as HTMLCanvasElement | null;
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
  const renderer = new Render(webGLRenderer);
  // tree

  const variables = new Variables({
    container,
    webGLRenderer,
    renderer,
  });

  // element listener
  elementListner(variables);

  const sceneDummy = Scene.createSceneDummy(canvas, 0);
  // webGLRenderer.adjustCanvas();
  webGLRenderer.render(sceneDummy)

  // webGLRenderer.renderTest();
};

main();
