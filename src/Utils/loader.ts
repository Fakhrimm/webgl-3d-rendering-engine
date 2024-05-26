import {Scene} from "../Object/scene.ts";
import {BufferGeometry} from "../Geometry/bufferGeometry.ts";
import {Material} from "../Material/material.ts";
import {BasicMaterial} from "../Material/basic-material.ts";
import {PhongMaterial} from "../Material/phong-material.ts";
import {MaterialTypes} from "../Types/material-types.ts";
import {Node} from "../Object/node.ts";
import {INode, IObliqueCamera, IOrthographicCamera, IPerspectiveCamera, ISceneNode} from "./model-interface.ts";
import {NodeTypes} from "../Types/node-types.ts";
import {Mesh} from "../Object/mesh.ts";
import {ObliqueCamera} from "../Camera/oblique-camera.ts";
import {ParallaxMaterial} from "../Material/parallax-material.ts";
import {ReflectionMaterial} from "../Material/reflection-material.ts";
import {OrthographicCamera} from "../Camera/orthographic-camera.ts";
import {PerspectiveCamera} from "../Camera/perspective-camera.ts";

export async function loadScene(file: File) {
    const data = await loadJSON(file);
    const geometryArray = getGeometryArray(data);
    const materialArray = getMaterialArray(data);
    const nodeArray = getNodeArray(data, geometryArray, materialArray);
    const scene = getScene(data, nodeArray);
    scenePreparation(scene);
    return scene;
}

function scenePreparation(scene: Scene) {
    scene.setActiveCamera(PerspectiveCamera)
}

function loadJSON(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const data = JSON.parse(e.target?.result as string);
            return resolve(data);
        };
        reader.onerror = () => reject("Failed to load JSON file");
        reader.readAsText(file);
    });
}

function getScene(data: any, nodeArray: Node[]){
    data.nodes.forEach((object: INode, index: number) => {
        console.log("parent index", index)
        const parent = nodeArray[index];
        parent.updateWorldMatrix();
        object.children.forEach((childIndex: number) => {
            console.log(childIndex)
            const child = nodeArray[childIndex];
            child.setParent(parent)
        });
    })
    return nodeArray[0] as Scene;
}

function getNodeArray(data: any, geometryArray: BufferGeometry[], materialArray: Material[]){
    const nodeArray: Node[] = [];
    data.nodes.forEach((object: INode) => {
        switch (object.nodeType) {
            case NodeTypes.SCENE:
                const scene = Scene.fromRaw(object as ISceneNode);
                nodeArray.push(scene);
                break;
            case NodeTypes.MESH:
                const meshIndex = object.mesh as number;
                const mesh = Mesh.fromRaws(object, geometryArray[meshIndex], materialArray[meshIndex]);
                nodeArray.push(mesh);
                break;
            case NodeTypes.OBLIQUE_CAMERA:
                const obliqueCamera = ObliqueCamera.fromRaw(object as IObliqueCamera);
                nodeArray.push(obliqueCamera);
                break;
            case NodeTypes.ORTHOGRAPHIC_CAMERA:
                const orthographicCamera = OrthographicCamera.fromRaw(object as IOrthographicCamera);
                nodeArray.push(orthographicCamera);
                break;
            case NodeTypes.PERSPECTIVE_CAMERA:
                const perspectiveCamera = PerspectiveCamera.fromRaw(object as IPerspectiveCamera);
                nodeArray.push(perspectiveCamera);
                break;
            case NodeTypes.NODE:
                const node = Node.fromRaw(object);
                nodeArray.push(node);
                break;
        }
    });
    return nodeArray;

}

function getGeometryArray(data: any){
    const geometryArray: BufferGeometry[] = [];
    const meshes = data.meshes;
    meshes.forEach((object: any) => {
        const bufferGeometry = BufferGeometry.fromRaw(object.geometry)
        geometryArray.push(bufferGeometry);
    });
    return geometryArray;
}

function getMaterialArray(data: any){
    const materialArray: Material[] = [];
    data.meshes.forEach((object: any) => {
        switch (object.material.type) {
            case MaterialTypes.BASIC:
                const basicMaterial = BasicMaterial.fromRaw(object.material);
                materialArray.push(basicMaterial);
                break;
            case MaterialTypes.PHONG:
                const phongMaterial = PhongMaterial.fromRaw(object.material);
                materialArray.push(phongMaterial);
                break;
            case MaterialTypes.PARALLAX:
                const parallaxMaterial = ParallaxMaterial.fromRaw(object.material)
                materialArray.push(parallaxMaterial);
                break;
            case MaterialTypes.REFLECTION:
                const reflectionMaterial = ReflectionMaterial.fromRaw(object.material);
                materialArray.push(reflectionMaterial);
                break;
        }
    });
    return materialArray;
}