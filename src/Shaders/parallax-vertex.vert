attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec3 a_tangent;

varying vec2 v_texCoord;
varying vec3 v_worldViewDirection;
varying vec3 v_lightDirection;

uniform mat4 u_viewProjection;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;
uniform vec3 u_reverseLightDirection;

void main() {
    v_texCoord = a_texcoord;

    // Dikalikan world inverse transpose untuk mendapatkan normal yang benar
    // Ketika dilakukan scaling
    // webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
    vec3 normal = normalize(mat3(u_worldInverseTranspose) * a_normal).xyz;

    // Perhitungan TBN
    // Dikalikan world inverse transpose untuk mendapatkan tangent yang benar
    vec3 tangent = (mat3(u_worldInverseTranspose) * a_tangent).xyz;
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

    vec4 viewSpacePosition = (u_view * u_world * a_position);

    v_worldViewDirection = normalize(invertedTBN * -viewSpacePosition.xyz);
    v_lightDirection = normalize(invertedTBN * u_reverseLightDirection);

    gl_Position = u_viewProjection * u_world * a_position;
}