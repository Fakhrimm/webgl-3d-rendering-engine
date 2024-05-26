import { Material } from "./material.ts";
import { Color } from "../Math/color.ts";
import { MaterialTypes } from "../Types/material-types.ts";
import { ProgramInfo } from "../WebGL/program-info.ts";
import { TextureTypes } from "../Types/texture-types.ts";
import { IPhongMaterial } from "../Utils/model-interface.ts";

export class PhongMaterial extends Material {
    private u_diffuseColor: Color;
    private u_specularColor: Color;
    private u_shininess: number;
    private u_ka: number;
    private u_kd: number;
    private u_ks: number;
    private diffuseTextureType: TextureTypes;
    private specularTextureType: TextureTypes;
    private normalTextureType: TextureTypes;
    private displacementTextureType: TextureTypes;
    private displacementScale: number;
    private displacementBias: number;

    constructor(
        u_diffuseColor: Color = Color.WHITE,
        u_specularColor: Color = Color.WHITE,
        u_shininess: number = 50,
        u_ka: number = 0.2,
        u_kd: number = 0.8,
        u_ks: number = 0.5,
        diffTextureType: TextureTypes = TextureTypes.DIFFUSE_0,
        specTextureType: TextureTypes = TextureTypes.SPECULAR_0,
        normalTextureType: TextureTypes = TextureTypes.NORMAL_1,
        displacementTextureType: TextureTypes = TextureTypes.DISPLACEMENT_0,
        displacementScale: number = 100,
        displacementBias: number = 0.0
    ) {
        super();
        this._materialType = MaterialTypes.PHONG;
        this.u_diffuseColor = u_diffuseColor;
        this.u_specularColor = u_specularColor;
        this.u_shininess = u_shininess;
        this.u_ka = u_ka;
        this.u_kd = u_kd;
        this.u_ks = u_ks;
        this.diffuseTextureType = diffTextureType;
        this.specularTextureType = specTextureType;
        this.normalTextureType = normalTextureType;
        this.displacementTextureType = displacementTextureType;
        this.displacementScale = displacementScale;
        this.displacementBias = displacementBias;
    }

    override setUniforms(
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
            u_displacementTexture: textures[this.displacementTextureType],
            u_displacementScale: this.displacementScale,
            u_displacementBias: this.displacementBias,
        });
    }

    public getDiffuseColor(): Color {
        return this.u_diffuseColor;
    }

    public setDiffuseColorFromRGB(r: number, g: number, b: number) {
        this.u_diffuseColor.setFromRGB(r, g, b);
    }

    public getSpecularColor(): Color {
        return this.u_specularColor;
    }

    public setSpecularColorFromRGB(r: number, g: number, b: number) {
        this.u_specularColor.setFromRGB(r, g, b);
    }

    public getShininess(): number {
        return this.u_shininess;
    }

    public setShininess(shininess: number) {
        this.u_shininess = shininess;
    }

    public setDiffuseTextureType(index: number) {
        if (index < 0 || index > 3) {
            throw new Error("Invalid texture type");
        }
        this.diffuseTextureType = index as TextureTypes;
    }

    public setSpecularTextureType(index: number) {
        if (index < 0 || index > 3) {
            throw new Error("Invalid texture type");
        }
        this.specularTextureType = (index + 4) as TextureTypes;
    }

    public setNormalTextureType(index: number) {
        if (index < 0 || index > 3) {
            throw new Error("Invalid texture type");
        }
        this.normalTextureType = (index + 8) as TextureTypes;
    }

    public getDisplacementScale(): number {
        return this.displacementScale;
    }

    public setDisplacementScale(value: number) {
        this.displacementScale = value;
    }

    public getDisplacementBias(): number {
        return this.displacementBias;
    }

    public setDisplacementBias(value: number) {
        this.displacementBias = value;
    }

    public toRaw(): IPhongMaterial {
        return {
            type: MaterialTypes.PHONG,
            u_diffuseColor: this.u_diffuseColor.get(),
            u_specularColor: this.u_specularColor.get(),
            u_shininess: this.u_shininess,
            u_ka: this.u_ka,
            u_kd: this.u_kd,
            u_ks: this.u_ks,
            diffTextureType: this.diffuseTextureType,
            specTextureType: this.specularTextureType,
            normalTextureType: this.normalTextureType,
            displacementTextureType: this.displacementTextureType,
            displacementScale: this.displacementScale,
            displacementBias: this.displacementBias,
        };
    }
    public static fromRaw(raw: IPhongMaterial): PhongMaterial {
        return new PhongMaterial(
            Color.fromArray(raw.u_diffuseColor),
            Color.fromArray(raw.u_specularColor),
            raw.u_shininess,
            raw.u_ka,
            raw.u_kd,
            raw.u_ks,
            raw.diffTextureType,
            raw.specTextureType,
            raw.normalTextureType,
            raw.displacementTextureType,
            raw.displacementScale,
            raw.displacementBias
        );
    }
}
