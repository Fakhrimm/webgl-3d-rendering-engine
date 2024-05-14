import { Camera } from "../Camera/camera";
import { OrthographicCamera } from "../Camera/orthographicCamera";
import { BufferAttribute } from "../Geometry/bufferAttribute";
import { Scene } from "../Object/scene";
import { ProgramInfo } from "./program-info";
import {Matrix4} from "../Math/matrix-4.ts";
import {Mesh} from "../Object/mesh.ts";
import {PlaneGeometry} from "../Geometry/planeGeometry.ts";

export class WebGLRenderer {
    canvas: HTMLCanvasElement
    gl: WebGLRenderingContext
    programInfo: ProgramInfo
    constructor(canvas: HTMLCanvasElement, programInfo: ProgramInfo) {
        this.canvas = canvas
        const gl = this.canvas.getContext("webgl")
        if (!gl) {
            throw new Error("No webgl support")
        }
        this.gl = gl
        this.programInfo = programInfo;
    }
    renderTest() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);

        this.programInfo.setUniforms({
            u_world: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
            u_viewProjection: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
        });

        const positionData = new Float32Array([
            0, 0, 0, 1,
            0, 100, 0, 1,
            1072, 0, 0, 1, 
        ])

        const colorData = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ])

        const bufferPositionAttribute = new BufferAttribute(positionData, 4)
        const bufferColorAttribute = new BufferAttribute(colorData, 4)

        const planarGeom = new PlaneGeometry(100, 100);
        const positionAttribute = planarGeom.attributes.position;

        const colorDataPlane = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ])
        const bufferColorPlane = new BufferAttribute(colorDataPlane, 4);

        this.programInfo.setAttributes({
            a_position: positionAttribute,
            a_color: bufferColorPlane
        });

        // this.programInfo.setAttributes({
        //     a_position: bufferPositionAttribute,
        //     a_color: bufferColorAttribute
        // });
        this.programInfo.setUniforms({
            u_matrix: [1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1],
        });
        this.programInfo.setUniforms({
            u_resolution: [this.canvas.width, this.canvas.height]
        });
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    renderTest2() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);

        const planarGeom = new PlaneGeometry(100, 100);
        this.programInfo.setAttributesAndIndices(planarGeom);

        this.programInfo.setUniforms({
            u_matrix: [1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1],
            u_resolution: [this.canvas.width, this.canvas.height]
        });
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    renderTest3() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);

        const planarGeom = new PlaneGeometry(100, 100);
        this.programInfo.setAttributesAndIndices(planarGeom);

        const orthographicCamera = new OrthographicCamera(-this.canvas.width/2, this.canvas.width/2, -this.canvas.height/2, this.canvas.height/2, -1, 1);


        this.programInfo.setUniforms({
            u_world: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ],
            u_viewProjection: orthographicCamera.viewProjectionMatrix.elements,
        });
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    adjustCanvas() {
        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth  = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        // Check if the canvas is not the same size.
        const needResize = this.canvas.width  !== displayWidth ||
                            this.canvas.height !== displayHeight;
        
        if (needResize) {
            // Make the canvas the same size
            this.canvas.width  = displayWidth;
            this.canvas.height = displayHeight;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(scene: Scene) {
        this.adjustCanvas();
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);

        const camera = this.getCamera(scene, OrthographicCamera)
        if (!camera) {
            throw new Error("No camera found in the scene");
        }

        scene.updateWorldMatrix(new Matrix4().identity());

        this.programInfo.setUniforms({
            u_viewProjection: camera.viewProjectionMatrix.elements
        });


        scene.traverse(node => {
            if (node instanceof Mesh) {
                const geometry = node.geometry;
                const positionAttribute = geometry.attributes.position;
                const colorAttribute = geometry.attributes.color;
                this.programInfo.setAttributes({
                    a_position: positionAttribute,
                    a_color: colorAttribute
                });
                this.gl.drawArrays(this.gl.TRIANGLES, 0, positionAttribute.data.length);
            }
        })
    }

    getCamera(scene: Scene, cameraType: new (...args: any[]) => Camera): Camera | null {
        let foundCamera: Camera | null = null;
        scene.traverseWithTotalBreak(node => {
            if (node instanceof cameraType) {
                foundCamera = node as Camera;
                return false;  // Found the camera, stop traversal
            }
            return true;  // Continue traversal otherwise
        });

        return foundCamera;
    }
}