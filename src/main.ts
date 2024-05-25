import "./style.css";
import { WebGLRenderer } from "./WebGL/webgl-renderer";
import { Scene } from "./Object/scene.ts";
import { Container } from "./UI/Container.ts";
import { Variables } from "./UI/Variables.ts";
import { Render } from "./UI/Render.ts";
import { elementListner } from "./UI/ElementListener.ts";
import { Tree } from "./UI/Tree.ts";
import { TextureLoader } from "./Texture/texture-loader.ts";

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

    const textureLoader = new TextureLoader();
    const textures = textureLoader.loadDefaultTexture(gl);
    textureLoader.loadTexture(gl, textures);

    // Load shaders
    const webGLRenderer = new WebGLRenderer(canvas, gl, textures);

    // Setup and render
    const renderer = new Render(webGLRenderer);

    const sceneDummy = Scene.createSceneDummy(webGLRenderer.canvas);

    const treeRoot = Tree.mapSceneToTree(sceneDummy);
    const originNode = sceneDummy.getOriginNode();

    const variables = new Variables({
        scene: sceneDummy,
        container,
        webGLRenderer,
        tree: treeRoot,
        renderer,
        originNode: originNode,
        originScene: sceneDummy,
    });

    // element listener
    elementListner(variables);
    container.getElement("activeComponent").innerHTML = treeRoot.name;

    // Render tree
    Tree.resetTree(container);
    // console.log(variables);
    Tree.mapTreeToComponentTree(container, treeRoot, variables);

    requestAnimationFrame(() => renderScene(webGLRenderer, variables, false));
};

export function renderScene(
    webGLRenderer: WebGLRenderer,
    variables: Variables,
    isRendering: boolean
) {
    if (isRendering) {
        // Still rendering the last frame, return immediately
        return;
    }

    isRendering = true;

    try {
        webGLRenderer.render(variables.getScene());
    } catch (error) {
        console.error("Failed to render scene:", error);
    } finally {
        isRendering = false;
    }
    // console.log("\n-----PREPARE-----");
    // console.log(webGLRenderer);
    // console.log(variables);
    // console.log(isRendering);
    // console.log("-----PREPARE-----\n");
    requestAnimationFrame(() =>
        renderScene(webGLRenderer, variables, isRendering)
    );
}

main();
