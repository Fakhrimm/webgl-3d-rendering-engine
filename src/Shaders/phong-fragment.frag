    precision mediump float;
     
    varying vec4 v_position;
    varying vec3 v_normal;

    uniform vec3 u_ambientColor;
    uniform vec3 u_diffuseColor;
    uniform vec3 u_specularColor;
    uniform float u_shininess;
    uniform float  u_ka;
    uniform float  u_kd;
    uniform float  u_ks;
    uniform vec3 u_reverseLightDirection;
    uniform int u_materialType;

    void main() {
        // https://www.cs.toronto.edu/~jacobson/phong-demo/
        vec3 normal = normalize(v_normal);
        vec3 light_direction = normalize(u_reverseLightDirection);
        float lambertian = max(dot(normal, light_direction), 0.0);
        vec3 reflect_direction = reflect(-light_direction, normal);
        vec3 view_direction = normalize(-v_position.xyz);
        float specularAngle = max(dot(reflect_direction, view_direction), 0.0);
        float specular = pow(specularAngle, u_shininess);

        gl_FragColor = vec4(u_ambientColor * u_ka +
                            u_diffuseColor * lambertian * u_kd +
                            u_specularColor * specular * u_ks, 1.0);
    }