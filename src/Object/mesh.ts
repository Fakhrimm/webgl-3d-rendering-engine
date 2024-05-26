import { BufferGeometry } from "../Geometry/bufferGeometry";
import { Material } from "../Material/material";
import { IMeshNode } from "../Utils/model-interface";
import { Node } from "./node";
import {NodeTypes} from "../Types/node-types.ts";
import {Euler} from "../Math/euler.ts";

class Mesh extends Node {
    material: Material
    geometry: BufferGeometry

    constructor(geometry: BufferGeometry, material: Material) {
        super()
        this.nodeType = NodeTypes.MESH
        this.geometry = geometry
        this.material = material
    }

    public toRaw(): IMeshNode {
        const raw = super.toRaw()
        return {
            name: raw.name,
            nodeType: raw.nodeType,
            position: raw.position, 
            scale: raw.scale,
            rotation: raw.rotation,
            children: raw.children,
        }
    }

    public static fromRaws(raw: IMeshNode, bufferGeometry: BufferGeometry, material: Material): Mesh {
        const mesh = new Mesh(bufferGeometry, material)
        mesh.name = raw.name
        mesh.setPosition(raw.position.x, raw.position.y, raw.position.z)
        mesh.setScale(raw.scale.x, raw.scale.y, raw.scale.z)
        mesh.setRotationFromEuler(new Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z))
        return mesh
    }
}

export { Mesh }