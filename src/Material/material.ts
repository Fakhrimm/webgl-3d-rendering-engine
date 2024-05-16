import {MaterialTypes} from "../Types/material-types.ts";
import {ProgramInfo} from "../WebGL/program-info.ts";

export abstract class Material {
    protected u_materialType: MaterialTypes = MaterialTypes.BASIC;

    public abstract setUniforms(programInfo: ProgramInfo): void;
    //
    // toJSON() {
    //     console.log('Material toJSON')
    // }
}