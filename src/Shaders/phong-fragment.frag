    precision mediump float;
     
    varying vec4 v_position;
    varying vec2 v_texCoord;
    varying mat3 v_tbn;

    uniform vec3 u_ambientColor;
    uniform vec3 u_diffuseColor;
    uniform vec3 u_specularColor;
    uniform float u_shininess;
    uniform float  u_ka;
    uniform float  u_kd;
    uniform float  u_ks;
    uniform vec3 u_reverseLightDirection;
    uniform int u_materialType;

    uniform sampler2D u_diffuseTexture;
    uniform sampler2D u_specularTexture;
    uniform sampler2D u_normalTexture;

    void main() {

        vec3 normal = texture2D(u_normalTexture, v_texCoord).rgb;
        normal = normal * 2.0 - 1.0;
        normal = normalize(v_tbn * normal);

        // https://www.cs.toronto.edu/~jacobson/phong-demo/
        vec3 light_direction = normalize(u_reverseLightDirection);
        float lambertian = max(dot(normal, light_direction), 0.0);
        vec3 reflect_direction = reflect(-light_direction, normal);
        vec3 view_direction = normalize(-v_position.xyz);
        float specularAngle = max(dot(reflect_direction, view_direction), 0.0);
        float specular = pow(specularAngle, u_shininess);

        vec4 textureDiffuseColor = texture2D(u_diffuseTexture, v_texCoord);
        vec4 textureSpecularColor = texture2D(u_specularTexture, v_texCoord);

        gl_FragColor = vec4(u_ambientColor * u_ka +
                            u_diffuseColor * textureDiffuseColor.xyz * lambertian * u_kd +
                            u_specularColor * specular * u_ks * textureSpecularColor.r, 1.0);
    }