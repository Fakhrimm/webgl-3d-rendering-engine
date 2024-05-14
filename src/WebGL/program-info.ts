import {
  AttributeMapSetters,
  AttributeSingleDataType,
  UniformSetters,
} from "../Types/webgl-types.ts";
import {
  createAttributeSetters,
  createProgram,
  createUniformSetters,
} from "./webgl-utils.ts";
import { BufferGeometry } from "../Geometry/bufferGeometry.ts";

export class ProgramInfo {
  program: WebGLProgram;
  uniformSetters: UniformSetters;
  attributeSetters: AttributeMapSetters;
  gl: WebGLRenderingContext;

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSources: string,
    fragmentShaderSource: string
  ) {
    this.program = createProgram(gl, vertexShaderSources, fragmentShaderSource);
    this.uniformSetters = createUniformSetters(gl, this.program);
    this.attributeSetters = createAttributeSetters(gl, this.program);
    this.gl = gl;
  }

  public setAttributesAndIndices(bufferGeometry: BufferGeometry) {
    const { attributes, indices } = bufferGeometry;
    this.setAttributes(attributes);
    if (indices) {
      const indexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        indices.data,
        this.gl.STATIC_DRAW
      );
    }
  }

  public setAttributes(attribs: { [key: string]: AttributeSingleDataType }) {
    Object.keys(attribs).forEach((name) => {
      const setter = this.attributeSetters[name];
      console.log(name, setter, attribs[name]);
      if (setter) {
        setter(attribs[name]);
      }
    });
  }

  public setUniforms(...values: { [key: string]: any }[]) {
    for (const uniforms of values) {
      Object.keys(uniforms).forEach((name) => {
        const setter = this.uniformSetters[name];
        if (setter) {
          setter(uniforms[name]);
        }
      });
    }
  }
}
