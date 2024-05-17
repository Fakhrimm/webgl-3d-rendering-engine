// uniform mat4 u_worldViewProjection;
uniform mat4 u_viewProjection;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;

void main() {
    // Memberi koordinat texture ke fragment shader
    v_texCoord = a_texcoord;

    // Mendapat koordinat dengan mengalikan matrix world dan view projection
    v_position = (u_viewProjection * u_world * a_position);

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
    gl_Position = v_position;
}