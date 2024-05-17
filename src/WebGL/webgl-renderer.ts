import {Camera} from "../Camera/camera";
import {OrthographicCamera} from "../Camera/orthographicCamera";
import {Scene} from "../Object/scene";
import {ProgramInfo} from "./program-info";
import {Mesh} from "../Object/mesh.ts";

export class WebGLRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    programInfo: ProgramInfo;
    constructor(canvas: HTMLCanvasElement, programInfo: ProgramInfo) {
        this.canvas = canvas;
        const gl = this.canvas.getContext("webgl");
        if (!gl) {
            throw new Error("No webgl support");
        }
        this.gl = gl;
        this.programInfo = programInfo;
    }

    adjustCanvas() {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize =
            this.canvas.width !== displayWidth ||
            this.canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(scene: Scene) {
        this.adjustCanvas();
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.useProgram(this.programInfo.program);

        const camera = this.getCamera(scene, OrthographicCamera);
        if (!camera) {
            throw new Error("No camera found in the scene");
        }

        scene.updateWorldMatrix();
        camera.updateWorldMatrix()

        this.programInfo.setUniforms({
            u_viewProjection: camera.viewProjectionMatrix.elements,
            u_ambientColor: [0.2, 0.2, 0.2],
            u_reverseLightDirection: [-10, 0, -10],
        });

        scene.traverse((node) => {
            if (node instanceof Mesh) {
                node.updateWorldMatrix();

                const material = node.material;
                material.setUniforms(this.programInfo);

                const geometry = node.geometry;
                this.programInfo.setAttributesAndIndices(geometry);
                this.programInfo.setUniforms({
                    u_world: node.getWorldMatrix().elements,
                    u_worldInverseTranspose: node.getWorldInverseTransposeMatrix().elements,
                });
                if (geometry.indices) {
                    this.gl.drawElements(
                        this.gl.TRIANGLES,
                        geometry.indices.length,
                        this.gl.UNSIGNED_SHORT,
                        0
                    );
                } else {
                    this.gl.drawArrays(
                        this.gl.TRIANGLES,
                        0,
                        geometry.attributes.a_position.data.length / 4
                    );
                }
            }
        });
    }

    getCamera(
        scene: Scene,
        cameraType: new (...args: any[]) => Camera
    ): Camera | null {
        let foundCamera: Camera | null = null;
        scene.traverseWithTotalBreak((node) => {
            if (node instanceof cameraType) {
                foundCamera = node as Camera;
                return false; // Found the camera, stop traversal
            }
            return true; // Continue traversal otherwise
        });

        return foundCamera;
    }
}
