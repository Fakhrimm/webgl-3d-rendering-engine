import { ObliqueCamera } from "../Camera/oblique-camera";
import { OrthographicCamera } from "../Camera/orthographic-camera";
import { PerspectiveCamera } from "../Camera/perspective-camera";
import { BufferGeometry } from "../Geometry/bufferGeometry";
import { Material } from "../Material/material";
import { Euler } from "../Math/euler";
import { Vector3 } from "../Math/vector-3";
import { Mesh } from "../Object/mesh";
import { Node } from "../Object/node";
import { Scene } from "../Object/scene";
import { FileManager } from "./file-manager";
import { IMesh, IModel, INode } from "./model-interface";

export class SaveLoader {
    static async saveModel(model: Scene, fileName: string) {
        const raw = this.modelToRaw(model);
        const json = JSON.stringify(raw, null, 2);
        await FileManager.writeFile(fileName, json);
    }

    static async loadModel(file: File, callback: (model: Scene) => void) {
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log("PASS1");
            const data = JSON.parse(e.target?.result as string);
            console.log("PASS2");
            const model = SaveLoader.modelFromRaw(data);
            console.log("PASS3");
            console.log("data", data);
            console.log("model", model);
            callback(model);
        };
        reader.readAsText(file);
    }

    static modelFromRaw(raw: IModel): Scene {
        const scene = new Scene();
        const nodeMap: { [key: number]: Node } = {};
        const meshMap: { [key: number]: Mesh } = {};
        scene.name = raw.nodes[0].name;

        if (raw.meshes) {
            raw.meshes.forEach((rawMesh, index) => {
                const geometry = BufferGeometry.fromRaw(rawMesh.geometry);
                const material = Material.fromRaw(rawMesh.material);
                const mesh = new Mesh(geometry, material, index);
                meshMap[index] = mesh;
            });
        }

        if (raw.nodes) {
            raw.nodes.forEach((rawNode, index) => {
                let node: Node;

                switch (rawNode.name) {
                    case "OrthoCamera":
                        node = new OrthographicCamera(
                            -rawNode.position.x,
                            rawNode.position.x,
                            rawNode.position.y,
                            -rawNode.position.y,
                            100,
                            -1000
                        );
                        break;
                    case "ObliqueCamera":
                        node = new ObliqueCamera(
                            -rawNode.position.x,
                            rawNode.position.x,
                            rawNode.position.y,
                            -rawNode.position.y,
                            100,
                            -1000
                        );
                        break;
                    case "PerspectiveCamera":
                        node = new PerspectiveCamera(60, 1, 50, -1000);
                        node.setPosition(
                            rawNode.position.x,
                            rawNode.position.y,
                            rawNode.position.z
                        );
                        break;
                    default:
                        if (rawNode.mesh !== undefined) {
                            node = meshMap[rawNode.mesh];
                        } else {
                            node = new Node();
                        }
                        break;
                }

                node.name = rawNode.name;
                node.setPosition(
                    rawNode.position.x,
                    rawNode.position.y,
                    rawNode.position.z
                );
                node.setScale(
                    new Vector3(
                        rawNode.scale.x,
                        rawNode.scale.y,
                        rawNode.scale.z
                    )
                );
                node.setRotationFromEuler(
                    new Euler(
                        rawNode.rotation.x,
                        rawNode.rotation.y,
                        rawNode.rotation.z
                    )
                );
                node.updateLocalMatrix();
                node.updateWorldMatrix();
                nodeMap[index] = node;
            });

            raw.nodes.forEach((rawNode, index) => {
                rawNode.children.forEach((childIndex) => {
                    nodeMap[childIndex].setParent(nodeMap[index]);
                });
            });
        }

        const rootNode = nodeMap[0];
        rootNode.getChildren().forEach((child) => {
            child.setParent(scene);
        });

        for (const node of Object.values(nodeMap)) {
            if (node instanceof PerspectiveCamera) {
                scene.activeCamera = node as PerspectiveCamera;
                break;
            }
        }

        if (!scene.getActiveCamera()) {
            for (const node of Object.values(nodeMap)) {
                if (node instanceof PerspectiveCamera) {
                    scene.setActiveCamera(PerspectiveCamera);
                    break;
                }
            }
        }

        console.log("SCENE HASIL", scene);
        return scene;
    }

    static modelToRaw(model: Scene): IModel {
        let [rawNodes, _, rawMeshes] = this.nodeToRaw(model, 0);
        var raw: IModel = { nodes: rawNodes, meshes: rawMeshes };

        return raw;
    }

    static meshToRaw(mesh: Mesh): IMesh {
        let rawMesh: IMesh = {
            geometry: mesh.geometry.toRaw(),
            material: mesh.material.toRaw(),
            animation: { name: "", frames: [] },
        };

        return rawMesh;
    }

    static nodeToRaw(
        node: Node,
        currIndex: number
    ): [INode[], number, IMesh[]] {
        let rawNodes: INode[] = [];
        let rawMeshes: IMesh[] = [];
        let rawNode = node.toRaw();
        rawNodes.push(rawNode);

        if (node.name.match(/^Mesh/i)) {
            rawMeshes.push(this.meshToRaw(node as Mesh));
        }

        node.getChildren().forEach((child) => {
            currIndex++;
            rawNode.children.push(currIndex);
            let rawChildNodes: INode[];
            let rawChildMeshes: IMesh[];
            [rawChildNodes, currIndex, rawChildMeshes] = this.nodeToRaw(
                child,
                currIndex
            );
            rawNodes = rawNodes.concat(rawChildNodes);
            rawMeshes = rawMeshes.concat(rawChildMeshes);
        });

        return [rawNodes, currIndex, rawMeshes];
    }
}
