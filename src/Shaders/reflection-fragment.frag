precision mediump float;

varying vec3 v_worldNormal;
varying vec4 v_worldPosition;
varying vec4 v_color;

uniform vec3 u_worldCameraPosition;
uniform samplerCube u_textureCubeMap;
uniform float u_useVertexColor;


void main() {
    if (u_useVertexColor > 0.9) {
        gl_FragColor = v_color;
        return;
    }
    vec3 worldNormal = normalize(v_worldNormal);
    vec3 eyeToSurfaceDir = normalize(vec3(v_worldPosition) - u_worldCameraPosition);
    vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

    gl_FragColor = textureCube(u_textureCubeMap, direction);
}