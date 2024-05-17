    precision mediump float;
     
    varying vec4 v_position;
//    varying vec2 v_texCoord;
    varying vec3 v_normal;
//    varying vec3 v_surfaceToLight;
//    varying vec3 v_surfaceToView;
//
//    uniform vec4 u_lightColor;
    uniform vec3 u_ambientColor;
    uniform vec3 u_diffuseColor;
    uniform vec3 u_specularColor;
    uniform float u_shininess;
    uniform float  u_ka;
    uniform float  u_kd;
    uniform float  u_ks;
//    uniform sampler2D u_diffuse;
//    uniform vec4 u_specular;
//    uniform float u_shininess;
//    uniform float u_specularFactor;
//    uniform int u_lightDirection;
    uniform vec3 u_reverseLightDirection;
    uniform int u_materialType;
     
//    vec4 lit(float l ,float h, float m) {
//        return vec4(1.0,
//                  max(l, 0.0),
//                  (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
//                  1.0);
//    }
     
    void main() {
        vec3 normal = normalize(v_normal);
        if (u_materialType == 0) {
            // https://www.cs.toronto.edu/~jacobson/phong-demo/
            vec3 light_direction = normalize(u_reverseLightDirection);
            float lambertian = max(dot(normal, light_direction), 0.0);

            gl_FragColor = vec4(u_ambientColor +
                                u_diffuseColor * lambertian, 1.0);
            return;
        } else if (u_materialType == 1) {
            // https://www.cs.toronto.edu/~jacobson/phong-demo/
            vec3 light_direction = normalize(u_reverseLightDirection);
            float lambertian = max(dot(normal, light_direction), 0.0);
            vec3 reflect_direction = reflect(-light_direction, normal);
            vec3 view_direction = normalize(-v_position.xyz);
            float specularAngle = max(dot(reflect_direction, view_direction), 0.0);
            float specular = pow(specularAngle, u_shininess);

            gl_FragColor = vec4(u_ambientColor * u_ka +
                                u_diffuseColor * lambertian * u_kd +
                                u_specularColor * specular * u_ks, 1.0);
            return;
        }

//        vec4 diffuseColor = texture2D(u_diffuse, v_texCoord);

        // Karena normal adalah varying dan hasil interpolasi
        // maka normal perlu dinormalisasi kembali
        vec3 a_normal = normalize(v_normal);

        float light = dot(a_normal, u_reverseLightDirection);
//        vec3 surfaceToLight = normalize(v_surfaceToLight);
//        vec3 surfaceToView = normalize(v_surfaceToView);
//        vec3 halfVector = normalize(surfaceToLight + surfaceToView);
//        vec4 litR = lit(dot(a_normal, surfaceToLight),
//                        dot(a_normal, halfVector), u_shininess);
//        vec4 outColor = vec4((
//        u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
//                    u_specular * litR.z * u_specularFactor)).rgb,
//          diffuseColor.a);
//        gl_FragColor = outColor;
        gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
        gl_FragColor.rgb *= light;
    }