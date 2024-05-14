import { WebGLRenderer } from "../WebGL/webgl-renderer";
import { Container } from "./Container";
import { Render } from "./Render";

interface VariableInterface {
  container: Container;
  webGLRenderer: WebGLRenderer;
  renderer: Render;
}

export class Variables {
  private _container: Container;
  private _webGLRenderer: WebGLRenderer;
  private _renderer: Render;

  constructor(props: VariableInterface) {
    const { container, webGLRenderer, renderer } = props;

    this._container = container;
    this._webGLRenderer = webGLRenderer;
    this._renderer = renderer;
  }

  public getRenderer() {
    return this._renderer;
  }

  public getWebGL() {
    return this._webGLRenderer;
  }

  public getContainer() {
    return this._container;
  }
}
