attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;
attribute vec4 a_color;

varying vec4 v_viewSpacePosition;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying mat3 v_tbn;
varying vec4 v_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;
uniform sampler2D u_displacementTexture;
uniform float u_displacementScale;
uniform float u_displacementBias;


void main() {
    v_color = a_color;
    // Memberi koordinat texture ke fragment shader
    v_texCoord = a_texcoord;

    vec4 fragPosition = u_world * a_position;

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    vec3 normal = normalize(mat3(u_worldInverseTranspose) * a_normal).xyz;

    // Mendapatkan posisi vertex dengan displacement mapping
    fragPosition = fragPosition + vec4(normal * (texture2D(u_displacementTexture, a_texcoord).r * u_displacementScale + u_displacementBias), 0);

    // Mendapat koordinat dengan mengalikan matrix world dan view projection
    v_viewSpacePosition = (u_view * fragPosition);

    // Dikalikan world inverse transpose untuk mendapatkan tangent yang benar
    vec3 tangent = (mat3(u_worldInverseTranspose) * a_tangent).xyz;

    // Gram-Schmidt process
    tangent = normalize(tangent - dot(tangent, normal) * normal);

    vec3 bitangent = cross(normal, tangent);

    v_tbn = mat3(tangent, bitangent, normal);

    v_normal = normal;

    gl_Position = u_projection * v_viewSpacePosition;
}