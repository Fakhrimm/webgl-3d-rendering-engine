import { Scene } from "../Object/scene";
import { WebGLRenderer } from "../WebGL/webgl-renderer";
import { Container } from "./Container";
import { Render } from "./Render";
import { TreeInterface } from "./Tree";
import { Node } from "../Object/node";

export interface VariableInterface {
    scene: Scene;
    container: Container;
    webGLRenderer: WebGLRenderer;
    tree: TreeInterface;
    renderer: Render;
    originNode: Node;
    originScene: Scene;
}

export class Variables {
    private _scene: Scene;
    private _container: Container;
    private _webGLRenderer: WebGLRenderer;
    private _tree: TreeInterface;
    private _renderer: Render;
    private _originNode: Node;
    private _originScene: Scene;

    constructor(props: VariableInterface) {
        const {
            scene,
            container,
            webGLRenderer,
            tree,
            renderer,
            originNode,
            originScene,
        } = props;

        this._scene = scene;
        this._container = container;
        this._webGLRenderer = webGLRenderer;
        this._tree = tree;
        this._renderer = renderer;
        this._originNode = originNode;
        this._originScene = originScene;
    }

    public getScene() {
        return this._scene;
    }

    public setScene(scene: Scene) {
        this._scene = scene;
    }

    public getContainer() {
        return this._container;
    }

    public getRenderer() {
        return this._renderer;
    }

    public getTree() {
        return this._tree;
    }

    public setTree(tree: TreeInterface) {
        this._tree = tree;
    }

    public getWebGL() {
        return this._webGLRenderer;
    }

    public getOriginNode() {
        return this._originNode;
    }

    public getOriginScene() {
        return this._originScene;
    }
}
