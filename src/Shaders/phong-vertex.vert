attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying mat3 v_tbn;

uniform mat4 u_viewProjection;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;
uniform sampler2D u_displacementTexture;
uniform float u_displacementScale;
uniform float u_displacementBias;


void main() {
    // Memberi koordinat texture ke fragment shader
    v_texCoord = a_texcoord;

    // Mendapat koordinat dengan mengalikan matrix world dan view projection
    v_position = (u_viewProjection * u_world * a_position);

    // Mendapatkan posisi vertex dengan displacement mapping
    v_position = v_position + vec4(a_normal * (texture2D(u_displacementTexture, a_texcoord).r * u_displacementScale + u_displacementBias), 0);

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    vec3 normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;

    // Dikalikan world inverse transpose untuk mendapatkan tangent yang benar
    vec3 tangent = (u_worldInverseTranspose * vec4(a_tangent, 0)).xyz;

    // Gram-Schmidt process
    tangent = normalize(tangent - dot(tangent, normal) * normal);

    vec3 bitangent = cross(normal, tangent);

    v_tbn = mat3(tangent, bitangent, normal);

    v_normal = normal;

    gl_Position = v_position;
}