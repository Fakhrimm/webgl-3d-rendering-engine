attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec2 v_texCoord;
varying vec3 v_worldNormal;
varying vec4 v_worldPosition;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

void main() {
    // Memberi koordinat texture ke fragment shader
    v_texCoord = a_texcoord;

    v_worldPosition = u_world * a_position;

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    v_worldNormal = (u_world * vec4(a_normal, 0)).xyz;

    gl_Position = u_projection * u_view * v_worldPosition;
}