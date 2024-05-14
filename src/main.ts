import "./style.css";
import { loadShader, ShaderType } from "./Shaders/shader-loader";
import { ProgramInfo } from "./WebGL/program-info.ts";
import { WebGLRenderer } from "./WebGL/webgl-renderer";
import { Scene } from "./Object/scene.ts";
import { Container } from "./UI/Container.ts";
import { Variables } from "./UI/Variables.ts";
import { Render } from "./UI/Render.ts";
import { elementListner } from "./UI/ElementListener.ts";
import { Tree } from "./UI/Tree.ts";

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

    const sceneDummy = Scene.createSceneDummy(canvas, 0);
    webGLRenderer.render(sceneDummy);

    const treeRoot = Tree.mapSceneToTree(sceneDummy);

    const variables = new Variables({
        scene: sceneDummy,
        container,
        webGLRenderer,
        tree: treeRoot,
        renderer,
    });

    // element listener
    elementListner(variables);
    container.getElement("activeComponent").innerHTML = treeRoot.name;

    // Render tree
    Tree.resetTree(container);
    Tree.mapTreeToComponentTree(container, treeRoot, variables);

    requestAnimationFrame(renderScene);

    function renderScene(now: number) {
        now *= 0.001;

        // const sceneDummy = Scene.createSceneDummy(canvas, now);

        webGLRenderer.render(sceneDummy);
        requestAnimationFrame(renderScene);
    }
    // webGLRenderer.renderTest();
};

main();
