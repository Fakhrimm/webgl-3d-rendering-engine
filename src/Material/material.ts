import { MaterialTypes } from "../Types/material-types.ts";
import { IMaterial } from "../Utils/model-interface.ts";
import { ProgramInfo } from "../WebGL/program-info.ts";

export abstract class Material {
    protected _materialType: MaterialTypes = MaterialTypes.BASIC;

    public abstract setUniforms(
        programInfo: ProgramInfo,
        textures: WebGLTexture[]
    ): void;

    public materialType() {
        return this._materialType;
    }

    public toRaw(): IMaterial {
        return {
            type: this._materialType,
        };
    }

    public static fromRaw(raw: IMaterial): Material {
        switch (raw.type) {
            case MaterialTypes.BASIC:
                const { BasicMaterial } = require("./basic-material");
                return new BasicMaterial();
            case MaterialTypes.PHONG:
                const { PhongMaterial } = require("./phong-material");
                return new PhongMaterial();
            default:
                throw new Error(`Unknown material type: ${raw.type}`);
        }
    }
}
