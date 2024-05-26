import {Camera} from "../Camera/camera";
import {Scene} from "../Object/scene";
import {ProgramInfo} from "./program-info";
import {Mesh} from "../Object/mesh.ts";
import {BufferGeometry} from "../Geometry/bufferGeometry.ts";
import {MaterialTypes} from "../Types/material-types.ts";
import {loadShader, ShaderType} from "../Shaders/shader-loader.ts";

export class WebGLRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    programInfos: ProgramInfo[] = [];
    textures: WebGLTexture[];
    textureCubeMap: WebGLTexture;

    constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, textures: WebGLTexture[], textureCubeMap: WebGLTexture) {
        this.canvas = canvas;
        this.gl = gl;
        this.textures = textures;
        this.textureCubeMap = textureCubeMap;
        this.loadProgramInfos();
    }

    render(scene: Scene) {
        this.initialSetup();

        const camera = scene.getActiveCamera();
        if (!camera) {
            throw new Error("No active camera found in the scene");
        }

        scene.updateWorldMatrix();
        camera.updateWorldMatrix()
        this.setGlobalUniforms(camera);

        scene.traverse((node) => {
            if (node instanceof Mesh) {
                node.updateWorldMatrix();

                const material = node.material;
                const programInfo = this.programInfos[material.materialType()];
                material.setUniforms(programInfo, this.textures);

                const geometry = node.geometry;
                programInfo.setAttributesAndIndices(geometry);
                programInfo.setUniforms({
                    u_world: node.getWorldMatrix().elements,
                    u_worldInverseTranspose: node.getWorldInverseTransposeMatrix().elements,
                });
                this.draw(geometry);
            } else if (!(node instanceof Camera)) {
                node.updateWorldMatrix();
            }
        });
    }

    private setGlobalUniforms(camera: Camera) {
        this.programInfos[MaterialTypes.BASIC].setUniforms({
            u_viewProjection: camera.viewProjectionMatrix.elements,
            u_ambientColor: [0.2, 0.2, 0.2],
            u_reverseLightDirection: [0, 0, 1],
        });

        this.programInfos[MaterialTypes.PHONG].setUniforms({
            u_view: camera.viewMatrix.elements,
            u_projection: camera.projectionMatrix.elements,
            u_ambientColor: [0.2, 0.2, 0.2],
            u_reverseLightDirection: [0, 0, 1],
        });
        this.programInfos[MaterialTypes.PARALLAX].setUniforms({
            u_view: camera.viewMatrix.elements,
            u_projection: camera.projectionMatrix.elements,
            u_viewProjection: camera.viewProjectionMatrix.elements,
            u_ambientColor: [0.2, 0.2, 0.2],
            u_reverseLightDirection: [0, 0, 1],
        });

        this.programInfos[MaterialTypes.REFLECTION].setUniforms({
            u_worldCameraPosition: camera.cameraPosition.toNumberArray(),
            u_projection: camera.projectionMatrix.elements,
            u_view: camera.viewMatrix.elements,
            u_textureCubeMap: this.textureCubeMap,
        });

    }

    private draw(geometry: BufferGeometry) {
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

        // Unbind the texture so the next texture show error and not use the previous texture
        this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    }

    private initialSetup() {
        this.adjustCanvas();
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    public loadProgramInfos() {
        this.programInfos[MaterialTypes.BASIC] = new ProgramInfo(
            this.gl,
            loadShader(ShaderType.BASIC_VERTEX),
            loadShader(ShaderType.BASIC_FRAGMENT)
        );

        this.programInfos[MaterialTypes.PHONG] = new ProgramInfo(
            this.gl,
            loadShader(ShaderType.PHONG_VERTEX),
            loadShader(ShaderType.PHONG_FRAGMENT)
        );

        this.programInfos[MaterialTypes.PARALLAX] = new ProgramInfo(
            this.gl,
            loadShader(ShaderType.PARALLAX_VERTEX),
            loadShader(ShaderType.PARALLAX_FRAGMENT)
        );

        this.programInfos[MaterialTypes.REFLECTION] = new ProgramInfo(
            this.gl,
            loadShader(ShaderType.REFLECTION_VERTEX),
            loadShader(ShaderType.REFLECTION_FRAGMENT)
        );
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
}
