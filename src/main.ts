import "./style.css";
import { ProgramInfo } from "./WebGL/program-info";
import { loadShader } from "./Shaders/shader-loader";
import { WebGLRenderer } from "./WebGL/webgl-renderer";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//   <div>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl");
if (!gl) {
  throw new Error("No webgl support");
}

const vertexShaderSource = loadShader("vertex");
const fragmentShaderSource = loadShader("fragment-basic");

const programInfo = new ProgramInfo(gl, vertexShaderSource, fragmentShaderSource);

const webGLRenderer = new WebGLRenderer(canvas, programInfo);
webGLRenderer.adjustCanvas();

webGLRenderer.render();

