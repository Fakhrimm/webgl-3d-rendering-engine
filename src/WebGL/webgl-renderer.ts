import { BufferAttribute } from "../Geometry/bufferAttribute";
import { ProgramInfo } from "./program-info";

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
    render() {
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);

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

        this.programInfo.setAttributes({
            a_position: bufferPositionAttribute,
            a_color: bufferColorAttribute
        });
        this.programInfo.setUniforms({
            u_matrix: [1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1],
        });
        this.programInfo.setUniforms({
            u_resolution: [this.canvas.width, this.canvas.height]
        });
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
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


}