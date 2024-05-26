precision mediump float;

varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec4 v_color;

uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_reverseLightDirection;
uniform float u_useVertexColor;

uniform sampler2D u_diffuseTexture;

void main() {
    if (u_useVertexColor > 0.9) {
        gl_FragColor = v_color;
        return;
    }

    vec3 normal = normalize(v_normal);
    vec3 light_direction = normalize(u_reverseLightDirection);
    float lambertian = max(dot(normal, light_direction), 0.0);
    vec4 textureDiffuseColor = texture2D(u_diffuseTexture, v_texCoord);

    gl_FragColor = vec4(u_ambientColor +
                        u_diffuseColor * textureDiffuseColor.xyz * lambertian, 1.0);
    return;
}