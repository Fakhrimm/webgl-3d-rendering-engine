precision mediump float;

varying vec3 v_normal;

uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_reverseLightDirection;

void main() {
    vec3 normal = normalize(v_normal);
    vec3 light_direction = normalize(u_reverseLightDirection);
    float lambertian = max(dot(normal, light_direction), 0.0);

    gl_FragColor = vec4(u_ambientColor +
                        u_diffuseColor * lambertian, 1.0);
    return;
}