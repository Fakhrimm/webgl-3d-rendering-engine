import { BufferGeometry } from "../Geometry/bufferGeometry";
import { Material } from "../Material/material";
import { IMeshNode } from "../Utils/model-interface";
import { Node } from "./node";

class Mesh extends Node {
    static meshCount = 0
    meshIndex: number
    material: Material
    geometry: BufferGeometry

    constructor(geometry: BufferGeometry, material: Material, meshIndex: number = Mesh.meshCount) {
        super()
        this.geometry = geometry
        this.material = material
        this.meshIndex = meshIndex
        Mesh.meshCount++
    }

    public toRaw(): IMeshNode {
        const raw = super.toRaw()
        return {
            mesh: this.meshIndex,
            name: raw.name,
            position: raw.position, 
            scale: raw.position,
            rotation: raw.rotation,
            children: raw.children,
        }
    } 
}

export { Mesh }