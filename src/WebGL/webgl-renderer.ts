import { Camera } from "../Camera/camera";
import { OrthographicCamera } from "../Camera/orthographicCamera";
import { BufferAttribute } from "../Geometry/bufferAttribute";
import { Scene } from "../Object/scene";
import { ProgramInfo } from "./program-info";
import {Matrix4} from "../Math/matrix-4.ts";
import {Mesh} from "../Object/mesh.ts";

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
        this.gl.useProgram(this.programInfo.program);
    
        const positionData = new Float32Array([
            // Vertices for both triangles
            0, 0, 0, 1,
            0, 100, 0, 1,
            1072, 0, 0, 1, 
            0, 100, 0, 1,
            1072, 100, 0, 1,
            1072, 0, 0, 1, 
        ])
    
        const colorData = new Float32Array([
            // Colors for all vertices
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            0, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 0, 1
        ])
    
        const indices = new Uint16Array([
            // Indices for the triangles
            0, 1, 2, // First triangle
            3, 4, 5  // Second triangle
        ])
    
        const bufferPositionAttribute = new BufferAttribute(positionData, 4)
        const bufferColorAttribute = new BufferAttribute(colorData, 4)
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
    
        this.programInfo.setAttributes({
            a_position: bufferPositionAttribute,
            a_color: bufferColorAttribute
        });
        this.programInfo.setUniforms({
            u_matrix: [1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1,
                    ]
        });
        this.programInfo.setUniforms({
            u_resolution: [this.canvas.width, this.canvas.height]
        });
        this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
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
                this.gl.drawArrays(this.gl.TRIANGLES, 0, positionAttribute.data.length / positionAttribute.size);
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