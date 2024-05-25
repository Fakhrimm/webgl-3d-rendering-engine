import { Material } from "./material.ts";
import { Color } from "../Math/color.ts";
import { TextureTypes } from "../Types/texture-types.ts";
import { ProgramInfo } from "../WebGL/program-info.ts";
import { MaterialTypes } from "../Types/material-types.ts";

export class ParallaxMaterial extends Material {
    private u_diffuseColor: Color;
    private u_specularColor: Color;
    private u_shininess: number;
    private u_ka: number;
    private u_kd: number;
    private u_ks: number;
    private diffuseTextureType: TextureTypes;
    private specularTextureType: TextureTypes;
    private normalTextureType: TextureTypes;
    private heightTextureType: TextureTypes;
    private heightScale: number;

    constructor(
        u_diffuseColor: Color = Color.WHITE,
        u_specularColor: Color = Color.WHITE,
        u_shininess: number = 50,
        u_ka: number = 0.2,
        u_kd: number = 0.8,
        u_ks: number = 0.5,
        diffTextureType: TextureTypes = TextureTypes.DIFFUSE_0,
        specTextureType: TextureTypes = TextureTypes.SPECULAR_0,
        normalTextureType: TextureTypes = TextureTypes.NORMAL_BRICKS,
        heightTextureType: TextureTypes = TextureTypes.HEIGHT_BRICKS,
        heightScale: number = 0.1
    ) {
        super();
        this._materialType = MaterialTypes.PARALLAX;
        this.u_diffuseColor = u_diffuseColor;
        this.u_specularColor = u_specularColor;
        this.u_shininess = u_shininess;
        this.u_ka = u_ka;
        this.u_kd = u_kd;
        this.u_ks = u_ks;
        this.diffuseTextureType = diffTextureType;
        this.specularTextureType = specTextureType;
        this.normalTextureType = normalTextureType;
        this.heightTextureType = heightTextureType;
        this.heightScale = heightScale;
    }

    public setUniforms(
        programInfo: ProgramInfo,
        textures: WebGLTexture[]
    ): void {
        programInfo.setUniforms({
            u_diffuseColor: this.u_diffuseColor.get(),
            u_specularColor: this.u_specularColor.get(),
            u_shininess: this.u_shininess,
            u_ka: this.u_ka,
            u_kd: this.u_kd,
            u_ks: this.u_ks,
            u_diffuseTexture: textures[this.diffuseTextureType],
            u_specularTexture: textures[this.specularTextureType],
            u_normalTexture: textures[this.normalTextureType],
            u_heightTexture: textures[this.heightTextureType],
            u_heightScale: this.heightScale,
        });
    }

    public setDiffuseColorFromRGB(r: number, g: number, b: number) {
        this.u_diffuseColor.setFromRGB(r, g, b);
    }

    public setSpecularColorFromRGB(r: number, g: number, b: number) {
        this.u_specularColor.setFromRGB(r, g, b);
    }

    public setShininess(shininess: number) {
        this.u_shininess = shininess;
    }

    public setHeightTextureType(value: number) {
        this.heightTextureType = value;
    }

    public setHeightScale(value: number) {
        this.heightScale = value;
    }
}
