import { BufferGeometry } from "../Geometry/bufferGeometry";
import { Material } from "../Material/material";
import { Node } from "./node";

class Mesh extends Node {
    material: Material
    geometry: BufferGeometry

    constructor(geometry: BufferGeometry, material: Material) {
        super()
        this.geometry = geometry
        this.material = material
    }
}