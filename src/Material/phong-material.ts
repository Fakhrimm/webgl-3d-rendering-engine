import {Material} from "./material.ts";
import {Color} from "../Math/color.ts";
import {MaterialTypes} from "../Types/material-types.ts";
import {ProgramInfo} from "../WebGL/program-info.ts";

export class PhongMaterial extends Material {
    private u_diffuseColor: Color;
    private u_specularColor: Color;
    private u_shininess: number;



    constructor(
        u_diffuseColor: Color = Color.GREEN,
        u_specularColor: Color = Color.WHITE,
        u_shininess: number = 32
    ) {
        super();
        this._materialType = MaterialTypes.PHONG;
        this.u_diffuseColor = u_diffuseColor;
        this.u_specularColor = u_specularColor;
        this.u_shininess = u_shininess;
    }

    override setUniforms(programInfo: ProgramInfo): void {
        programInfo.setUniforms({
            u_materialType: this._materialType,
            u_diffuseColor: this.u_diffuseColor.get(),
            u_specularColor: this.u_specularColor.get(),
            u_shininess: this.u_shininess,
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
}