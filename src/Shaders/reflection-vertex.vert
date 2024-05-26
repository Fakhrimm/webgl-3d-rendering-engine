attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;

varying vec2 v_texCoord;
varying vec3 v_worldNormal;
varying vec4 v_worldPosition;
varying vec4 v_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

void main() {
    v_color = a_color;
    // Memberi koordinat texture ke fragment shader
    v_texCoord = a_texcoord;

    v_worldPosition = u_world * a_position;

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    v_worldNormal = (mat3(u_worldInverseTranspose) * a_normal).xyz;

    gl_Position = u_projection * u_view * v_worldPosition;
}