import {BufferAttribute} from "../Geometry/bufferAttribute";
import {AttributeMapSetters, AttributeSetters, UniformSetters} from "../Types/webgl-types";

export function createProgram (gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    const program = gl.createProgram();
    if (!program) {
        throw new Error("Failed to create program");
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error("Failed to link program");
    }
    return program;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error("Failed to create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const err: string = `Shader compilation failed: ${gl.getShaderInfoLog(shader)}`;

        console.error(err);
        gl.deleteShader(shader);
        throw err;
    }
    return shader;
}

export function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram) {
    function createUniformSetter(program: WebGLProgram, uniformInfo: WebGLActiveInfo) {
        const location = gl.getUniformLocation(program, uniformInfo.name);
        const type = uniformInfo.type;
        const isArray = uniformInfo.size > 1 && uniformInfo.name.substring(-3) === "[0]";
        if (type === gl.FLOAT && isArray) {
            return function (v: Iterable<number>) {
                gl.uniform1fv(location, v);
            };
        }
        if (type === gl.FLOAT) {
            return function (v: number) {
                gl.uniform1f(location, v);
            };
        }
        if (type === gl.FLOAT_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3fv(location, v);
            };
        }
        if (type === gl.FLOAT_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4fv(location, v);
            };
        }
        if (type === gl.INT && isArray) {
            return function (v: Iterable<number>) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.INT) {
            return function (v: number) {
                gl.uniform1i(location, v);
            };
        }
        if (type === gl.INT_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.INT_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.INT_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.BOOL) {
            return function (v: Iterable<number>) {
                gl.uniform1iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC2) {
            return function (v: Iterable<number>) {
                gl.uniform2iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC3) {
            return function (v: Iterable<number>) {
                gl.uniform3iv(location, v);
            };
        }
        if (type === gl.BOOL_VEC4) {
            return function (v: Iterable<number>) {
                gl.uniform4iv(location, v);
            };
        }
        if (type === gl.FLOAT_MAT2) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix2fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT3) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix3fv(location, false, v);
            };
        }
        if (type === gl.FLOAT_MAT4) {
            return function (v: Iterable<number>) {
                gl.uniformMatrix4fv(location, false, v);
            };
        }
        throw "unknown type: 0x" + type.toString(16);
    }

    const uniformSetters: UniformSetters = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let ii = 0; ii < numUniforms; ++ii) {
        const uniformInfo = gl.getActiveUniform(program, ii);
        if (!uniformInfo) {
            break;
        }
        let name = uniformInfo.name;
        if (name.substring(-3) === "[0]") {
            name = name.substring(0, name.length - 3);
        }
        uniformSetters[name] = createUniformSetter(program, uniformInfo);
    }
    return uniformSetters;
}

export function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram): AttributeMapSetters {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
        // Initialization Time
        const loc = gl.getAttribLocation(program, info.name);
        const buf = gl.createBuffer();
        return (...values) => {
            // Render Time (saat memanggil setAttributes() pada render loop)
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            const v = values[0];
            if (v instanceof BufferAttribute) {

                // Data Changed Time (note that buffer is already binded)
                gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, v.size, v.dtype, v.normalize, v.stride, v.offset);
            } else  {
                gl.disableVertexAttribArray(loc);
                if (v instanceof Float32Array)
                    switch (v.length) {
                        case 4:
                            gl.vertexAttrib4fv(loc, v);
                            break;
                        case 3:
                            gl.vertexAttrib3fv(loc, v);
                            break;
                        case 2:
                            gl.vertexAttrib2fv(loc, v);
                            break;
                        case 1:
                            gl.vertexAttrib1fv(loc, v);
                            break;
                        default:
                            throw new Error('the length of a float constant value must be between 1 and 4!');
                    }
                else
                    switch (values.length) {
                        case 4:
                            gl.vertexAttrib4f(loc, values[0], values[1], values[2], values[3]);
                            break;
                        case 3:
                            gl.vertexAttrib3f(loc, values[0], values[1], values[2]);
                            break;
                        case 2:
                            gl.vertexAttrib2f(loc, values[0], values[1]);
                            break;
                        case 1:
                            if (typeof values[0] === 'number')
                            gl.vertexAttrib1f(loc, values[0]);
                            break;
                        default:
                            throw new Error('the length of a float constant value must be between 1 and 4!');
                    }
            }
        }
    }

    const attribSetters: AttributeMapSetters = {};
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) continue;
        attribSetters[info.name] = createAttributeSetter(info);
    }
    return attribSetters;
}
