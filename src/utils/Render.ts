import { Camera } from "../Camera/camera";
import { WebGLRenderer } from "../WebGL/webgl-renderer";
import { Variables } from "./Variables";

export class Render {
  private _webGLRenderer: WebGLRenderer;
  private _camera: Camera;
  private _shading: boolean = false;
  private _projection: "orthographic" | "perspective" | "oblique" =
    "orthographic";

  constructor(webGLRenderer: WebGLRenderer) {
    this._webGLRenderer = webGLRenderer;
    this._camera = new Camera();
    this.setProjection("orthographic");
  }

  public setShading(shading: boolean) {
    this._shading = shading;
  }

  public getShading() {
    return this._shading;
  }

  public setProjection(projection: "orthographic" | "perspective" | "oblique") {
    this._projection = projection;
  }

  public getProjection() {
    return this._projection;
  }

  public render(variables: Variables) {}

  public reset() {}
}
