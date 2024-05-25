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

    static async loadModel(
        file: File,
        canvas: HTMLCanvasElement,
        callback: (model: Scene) => void
    ) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            console.log("PASS1");
            const data = JSON.parse(e.target?.result as string);
            console.log("PASS2", data);
            const model = await SaveLoader.modelFromRaw(data, canvas);
            console.log("PASS3", model);
            callback(model);
        };
        reader.readAsText(file);
    }

    static async modelFromRaw(
        raw: IModel,
        canvas: HTMLCanvasElement
    ): Promise<Scene> {
        const nodeMap: { [key: number]: Node } = {};
        const meshMap: { [key: number]: Mesh } = {};

        const scene = new Scene();
        scene.name = raw.nodes[0].name;

        console.log("YES1");
        console.log(meshMap);
        console.log(raw);
        console.log(raw.meshes);

        if (raw.meshes !== undefined) {
            console.log("MASUK");
            const meshPromises = raw.meshes.map(async (rawMesh, index) => {
                const geometry = await BufferGeometry.fromRaw(rawMesh.geometry);
                console.log("GEO", geometry);
                const material = await Material.fromRaw(rawMesh.material);
                console.log("material", material);
                const mesh = new Mesh(geometry, material, index);
                console.log("NEW MESH", mesh);
                meshMap[index] = mesh;
            });
            await Promise.all(meshPromises);
        }
        console.log(meshMap);
        console.log("YES2");

        if (raw.nodes) {
            raw.nodes.forEach((rawNode, index) => {
                let node: Node;
                console.log(rawNode.name);

                switch (rawNode.name) {
                    case "OriginNode":
                        node = new Node();
                        node.name = rawNode.name;
                        // node.setParent(scene);
                        break;
                    case "OrthoCamera":
                        node = new OrthographicCamera(
                            -canvas.width / 2,
                            canvas.width / 2,
                            canvas.height / 2,
                            -canvas.height / 2,
                            500,
                            -500
                        );
                        node.name = rawNode.name;
                        break;
                    case "ObliqueCamera":
                        node = new ObliqueCamera(
                            -canvas.width / 2,
                            canvas.width / 2,
                            canvas.height / 2,
                            -canvas.height / 2,
                            100,
                            -1000
                        );
                        node.name = rawNode.name;
                        break;
                    case "PerspectiveCamera":
                        node = new PerspectiveCamera(
                            70,
                            canvas.width / canvas.height,
                            0.1,
                            1000,
                            1
                        );
                        node.name = rawNode.name;
                        console.log("INI");
                        node.setPosition(
                            rawNode.position.x,
                            rawNode.position.y,
                            rawNode.position.z
                        );
                        console.log("INI");
                        break;
                    default:
                        if (rawNode.mesh !== undefined) {
                            console.log("SINI DONG", meshMap);
                            console.log("rawnode", rawNode);
                            console.log("SINI DONG", rawNode.name);
                            console.log("rawNode.mesh", rawNode.mesh);
                            node = meshMap[rawNode.mesh - 1];
                            if (!node) {
                                console.error(
                                    `Mesh with index ${
                                        rawNode.mesh - 1
                                    } not found in meshMap.`
                                );
                                return;
                            }
                            console.log("TES", meshMap[0]);
                            console.log("HASIL", node);
                            node.name = rawNode.name;
                        } else {
                            console.log("APASINI");
                            node = new Node();
                            node.name = rawNode.name;
                        }
                        break;
                }

                console.log("ONO", node);
                node.setPosition(
                    rawNode.position.x,
                    rawNode.position.y,
                    rawNode.position.z
                );
                console.log("ONO");
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
        console.log("YES3");
        console.log(nodeMap);

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
