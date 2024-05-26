precision mediump float;

varying vec2 v_texCoord;
varying vec3 v_worldViewDirection;
varying vec3 v_lightDirection;

uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform float  u_ka;
uniform float  u_kd;
uniform float  u_ks;
uniform int u_materialType;
uniform float u_heightScale;
uniform vec3 u_reverseLightDirection;

uniform sampler2D u_diffuseTexture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_heightTexture;

vec2 parallaxMapping(vec3 viewDir, vec2 texCoords) {
    float height = texture2D(u_heightTexture, texCoords).r;
    vec2 texCoordsOffset = viewDir.xy * (height * u_heightScale);
    return vec2(texCoords.x - texCoordsOffset.x, texCoords.y + texCoordsOffset.y);
}

void main() {
    vec3 worldViewDirection = normalize(v_worldViewDirection);
    vec3 lightDirection = normalize(v_lightDirection);

    vec2 texCoord = parallaxMapping(worldViewDirection, v_texCoord);
    if (texCoord.x > 1.0 || texCoord.y > 1.0 || texCoord.x < 0.0 || texCoord.y < 0.0) {
        discard;
    }

    vec3 normal = texture2D(u_normalTexture, texCoord).rgb;
    normal = normalize(normal * 2.0 - 1.0);

    // https://www.cs.toronto.edu/~jacobson/phong-demo/

    float lambertian = max(dot(normal, lightDirection), 0.0);
    vec3 reflect_direction = reflect(-lightDirection, normal);
    float specularAngle = max(dot(reflect_direction, worldViewDirection), 0.0);
    float specular = pow(specularAngle, u_shininess);

    vec4 textureDiffuseColor = texture2D(u_diffuseTexture, texCoord);
    vec4 textureSpecularColor = texture2D(u_specularTexture, texCoord);

    gl_FragColor = vec4(u_ambientColor * u_ka +
                        u_diffuseColor * textureDiffuseColor.xyz * lambertian * u_kd
                        + u_specularColor * specular * u_ks * textureSpecularColor.r
    , 1.0
    );
}