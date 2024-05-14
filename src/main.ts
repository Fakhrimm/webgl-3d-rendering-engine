import "./style.css";
import { loadShader, ShaderType } from "./Shaders/shader-loader";
import { ProgramInfo } from "./WebGL/program-info.ts";
import { WebGLRenderer } from "./WebGL/webgl-renderer";
import { Scene } from "./Object/scene.ts";
import { Container } from "./utils/Container.ts";
import { Variables } from "./utils/Variables.ts";
import { Render } from "./utils/Render.ts";
import { elementListner } from "./utils/ElementListener.ts";
import { Tree } from "./utils/Tree.ts";

const buildTreeHtml = (node: any) => {
    let html = `<li>${node.name}`;
    if (node.children.length > 0) {
        html += `<ul>`;
        node.children.forEach((child: any) => {
            html += buildTreeHtml(child);
        });
        html += `</ul>`;
    }
    html += `</li>`;
    return html;
};

const findNode = (root: any, name: string): any | null => {
    if (root.name === name) {
        return root;
    }
    for (const child of root.children) {
        const result = findNode(child, name);
        if (result) {
            return result;
        }
    }
    return null;
};

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
        model: sceneDummy,
        container,
        webGLRenderer,
        tree: treeRoot,
        renderer,
    });

    // element listener
    elementListner(variables);

    // Render tree
    Tree.resetTree(container);
    Tree.mapTreeToComponentTree(container, treeRoot, variables);

    // webGLRenderer.renderTest();
};

main();
