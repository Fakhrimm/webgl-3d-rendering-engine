import {Material} from "./material.ts";
import {ProgramInfo} from "../WebGL/program-info.ts";
import {MaterialTypes} from "../Types/material-types.ts";
import {IReflectionMaterial } from "../Utils/model-interface.ts";

export class ReflectionMaterial extends Material {

    constructor(

    ) {
        super();
        this._materialType = MaterialTypes.REFLECTION;
    }

    public setUniforms(
        programInfo: ProgramInfo,
        textures: WebGLTexture[]
    ): void {

    }

    public toRaw(): IReflectionMaterial {
        return {
            type: MaterialTypes.REFLECTION
        };
    }

    public static fromRaw(raw: IReflectionMaterial): ReflectionMaterial {
        return new ReflectionMaterial();
    }
}
