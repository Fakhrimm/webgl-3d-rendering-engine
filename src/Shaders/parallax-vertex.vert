attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_tangentViewDirection;
varying vec3 v_tangentLightDirection;

uniform mat4 u_viewProjection;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_world;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;
uniform vec3 u_reverseLightDirection;

void main() {
    v_texCoord = a_texcoord;
    v_position = u_view * u_world * a_position;

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    vec3 normal = normalize(u_worldInverseTranspose * vec4(a_normal, 0)).xyz;

    // Perhitungan TBN
    // Dikalikan world inverse transpose untuk mendapatkan tangent yang benar
    vec3 tangent = (u_worldInverseTranspose * vec4(a_tangent, 0)).xyz;
    // Gram-Schmidt process
    tangent = normalize(tangent - dot(tangent, normal) * normal);
    vec3 bitangent = cross(normal, tangent);
    // Bisa menginvert TBN matrix dengan transpose karena TBN matrix adalah orthogonal
    mat3 TBN = mat3(tangent, bitangent, normal);
    mat3 invertedTBN = mat3(
        TBN[0][0], TBN[1][0], TBN[2][0],
        TBN[0][1], TBN[1][1], TBN[2][1],
        TBN[0][2], TBN[1][2], TBN[2][2]
    );

    v_tangentViewDirection = invertedTBN * normalize(-v_position.xyz);
    v_tangentLightDirection = invertedTBN * normalize(u_reverseLightDirection);

    gl_Position = u_viewProjection * u_world * a_position;
}