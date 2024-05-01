import { Geometry } from "../Geometry/geometry";
import { Material } from "../Material/material";
import { Node } from "./node";

class Mesh extends Node {
    material: Material
    geometry: Geometry

    constructor(geometry: Geometry, material: Material) {
        super()
        this.geometry = geometry
        this.material = material
    }
    
}