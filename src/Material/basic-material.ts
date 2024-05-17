import {Material} from "./material.ts";
import {Color} from "../Math/color.ts";
import {MaterialTypes} from "../Types/material-types.ts";
import {ProgramInfo} from "../WebGL/program-info.ts";
import {DiffuseTextureTypes} from "../Types/diffuse_texture_types.ts";

export class BasicMaterial extends Material {
    protected u_diffuseColor: Color;
    protected diffuseTextureType: DiffuseTextureTypes;

    constructor(u_diffuseColor: Color = Color.GREEN, diffuseTextureType: DiffuseTextureTypes = DiffuseTextureTypes.IMAGE_0) {
        super()
        this.u_materialType = MaterialTypes.BASIC
        this.u_diffuseColor = u_diffuseColor
        this.diffuseTextureType = diffuseTextureType
    }

    override setUniforms(programInfo: ProgramInfo): void {
        programInfo.setUniforms({
            u_materialType: this.u_materialType,
            u_diffuseColor: this.u_diffuseColor.get(),
        })
    }

    public setDiffuseColor(r: number, g: number, b: number) {
        this.u_diffuseColor.set(r, g, b)
    }

}