precision mediump float;

varying vec2 v_texCoord;
varying vec3 v_normal;

uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_reverseLightDirection;

uniform sampler2D u_diffuseTexture;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 light_direction = normalize(u_reverseLightDirection);
    float lambertian = max(dot(normal, light_direction), 0.0);
    vec4 textureDiffuseColor = texture2D(u_diffuseTexture, v_texCoord);

    gl_FragColor = vec4(u_ambientColor +
                        u_diffuseColor * textureDiffuseColor.xyz * lambertian, 1.0);
    return;
}