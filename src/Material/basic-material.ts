import { Material } from "./material.ts";
import { Color } from "../Math/color.ts";
import { MaterialTypes } from "../Types/material-types.ts";
import { ProgramInfo } from "../WebGL/program-info.ts";
import { TextureTypes } from "../Types/texture-types.ts";
import { IBasicMaterial } from "../Utils/model-interface.ts";

export class BasicMaterial extends Material {
    protected u_diffuseColor: Color;
    protected u_ambientColor: Color
    protected diffuseTextureType: TextureTypes;

    constructor(
        u_diffuseColor: Color = Color.BLACK,
        u_ambientColor: Color = Color.GREEN,
        textureType: TextureTypes = TextureTypes.DIFFUSE_2
    ) {
        super();
        this._materialType = MaterialTypes.BASIC;
        this.u_diffuseColor = u_diffuseColor;
        this.u_ambientColor = u_ambientColor
        this.diffuseTextureType = textureType;
    }

    override setUniforms(
        programInfo: ProgramInfo,
        textures: WebGLTexture[]
    ): void {
        programInfo.setUniforms({
            u_diffuseColor: this.u_diffuseColor.get(),
            u_ambientColor: this.u_ambientColor,
            u_diffuseTexture: textures[this.diffuseTextureType],
        });
    }

    public getDiffuseColor(): Color {
        return this.u_diffuseColor;
    }

    public setDiffuseColorFromRGB(r: number, g: number, b: number) {
        this.u_diffuseColor.setFromRGB(r, g, b);
    }

    public setAmbientColor(): Color {
        return this.u_ambientColor;
    }

    public setAmbientColorFromRGB(r: number, g: number, b: number) {
        this.u_ambientColor.setFromRGB(r, g, b);
    }

    public setDiffuseTextureType(textureType: TextureTypes) {
        if (
            textureType < TextureTypes.DIFFUSE_0 ||
            textureType > TextureTypes.DIFFUSE_3
        ) {
            throw new Error("Invalid texture type");
        }
        this.diffuseTextureType = textureType;
    }

    public toRaw(): IBasicMaterial {
        return {
            type: MaterialTypes.BASIC,
            u_diffuseColor: this.u_diffuseColor.get(),
            u_ambientColor: this.u_ambientColor.get(),
            diffuseTextureType: this.diffuseTextureType,
        };
    }
    public static fromRaw(raw: IBasicMaterial): BasicMaterial {
        return new BasicMaterial(
            new Color(raw.u_diffuseColor[0], raw.u_diffuseColor[1], raw.u_diffuseColor[2]),
            new Color(raw.u_ambientColor[0], raw.u_ambientColor[1], raw.u_ambientColor[2]),
            raw.diffuseTextureType
        )
    }
}
