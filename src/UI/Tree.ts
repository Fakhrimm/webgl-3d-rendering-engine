import { BasicMaterial } from "../Material/basic-material";
import { ParallaxMaterial } from "../Material/parallax-material";
import { PhongMaterial } from "../Material/phong-material";
import { Mesh } from "../Object/mesh";
import { Scene } from "../Object/scene";
import { Container } from "./Container";
import { Variables } from "./Variables";

export interface TreeInterface {
    name: string;
    reference: Scene;
    level: number;
    children: TreeInterface[];
}

export class Tree {
    public static mapSceneToTree(
        scene: Scene,
        level: number = 0
    ): TreeInterface {
        const treeNode: TreeInterface = {
            name: scene.name,
            level: level,
            reference: scene,
            children: scene
                .getChildren()
                .map((child) => Tree.mapSceneToTree(child as Scene, level + 1)),
        } as const;
        return treeNode;
    }

    public static resetTree(container: Container) {
        container.clearComponent("#componentTree");
    }

    public static mapTreeToComponentTree(
        container: Container,
        treeNode: TreeInterface,
        variables: Variables
    ) {
        const button = container.addButton({
            id: treeNode.name,
            depth: treeNode.level,
            onClick: () => {
                // Update active component
                variables.setTree(treeNode);
                container.getElement("activeComponent").innerHTML =
                    treeNode.name;
                const activeComponent = variables.getTree().reference;

                // Update sliders to current value of activeComponent
                const rotateX = container.getElement(
                    "rotateX"
                ) as HTMLInputElement;
                const rotateY = container.getElement(
                    "rotateY"
                ) as HTMLInputElement;
                const rotateZ = container.getElement(
                    "rotateZ"
                ) as HTMLInputElement;
                const scaleX = container.getElement(
                    "scaleX"
                ) as HTMLInputElement;
                const scaleY = container.getElement(
                    "scaleY"
                ) as HTMLInputElement;
                const scaleZ = container.getElement(
                    "scaleZ"
                ) as HTMLInputElement;
                const translateX = container.getElement(
                    "translateX"
                ) as HTMLInputElement;
                const translateY = container.getElement(
                    "translateY"
                ) as HTMLInputElement;
                const translateZ = container.getElement(
                    "translateZ"
                ) as HTMLInputElement;

                // Set slider value
                const rotation = activeComponent.getRotation();
                rotateX.value = (rotation.x / (Math.PI * 1.5)).toString();
                rotateY.value = (rotation.y / (Math.PI * 1.5)).toString();
                rotateZ.value = (rotation.z / (Math.PI * 1.5)).toString();

                const scale = activeComponent.getScale();
                scaleX.value = scale.x.toString();
                scaleY.value = scale.y.toString();
                scaleZ.value = scale.z.toString();

                const position = activeComponent.getPosition();
                const canvasWidth = variables.getWebGL().canvas.width;
                const canvasHeight = variables.getWebGL().canvas.height;

                translateX.value = (
                    ((position.x + canvasWidth / 2) / canvasWidth) * 6.6 -
                    3.3
                ).toString();
                translateY.value = (
                    ((position.y + canvasHeight / 2) / canvasHeight) * 6.6 -
                    3.3
                ).toString();
                translateZ.value = (position.z / 5).toString();

                // Update color pickers
                if (activeComponent instanceof Mesh) {
                    const material = activeComponent.material;
                    const colorPickerDiffuse = container.getElement(
                        "colorPickerDiffuse"
                    ) as HTMLInputElement;
                    const rValueDiffuse = container.getElement(
                        "rValueDiffuse"
                    ) as HTMLInputElement;
                    const gValueDiffuse = container.getElement(
                        "gValueDiffuse"
                    ) as HTMLInputElement;
                    const bValueDiffuse = container.getElement(
                        "bValueDiffuse"
                    ) as HTMLInputElement;
                    const colorPickerSpecular = container.getElement(
                        "colorPickerSpecular"
                    ) as HTMLInputElement;
                    const rValueSpecular = container.getElement(
                        "rValueSpecular"
                    ) as HTMLInputElement;
                    const gValueSpecular = container.getElement(
                        "gValueSpecular"
                    ) as HTMLInputElement;
                    const bValueSpecular = container.getElement(
                        "bValueSpecular"
                    ) as HTMLInputElement;
                    const shininess = container.getElement(
                        "shininess"
                    ) as HTMLInputElement;
                    const displacementScale = container.getElement(
                        "displacementScale"
                    ) as HTMLInputElement;
                    const displacementBias = container.getElement(
                        "displacementBias"
                    ) as HTMLInputElement;
                    const heightTexture = container.getElement(
                        "heightTexture"
                    ) as HTMLInputElement;
                    const heightScale = container.getElement(
                        "heightScale"
                    ) as HTMLInputElement;

                    // Set value for color pickers
                    if (
                        material instanceof BasicMaterial ||
                        material instanceof PhongMaterial ||
                        material instanceof ParallaxMaterial
                    ) {
                        const diffuseColor = material
                            .getDiffuseColor()
                            .getFromRGB();
                        colorPickerDiffuse.value = `#${(
                            (1 << 24) +
                            (diffuseColor.r << 16) +
                            (diffuseColor.g << 8) +
                            diffuseColor.b
                        )
                            .toString(16)
                            .slice(1)}`;
                        rValueDiffuse.value = diffuseColor.r.toString();
                        gValueDiffuse.value = diffuseColor.g.toString();
                        bValueDiffuse.value = diffuseColor.b.toString();
                    }

                    if (
                        material instanceof PhongMaterial ||
                        material instanceof ParallaxMaterial
                    ) {
                        const specularColor = material
                            .getSpecularColor()
                            .getFromRGB();
                        colorPickerSpecular.value = `#${(
                            (1 << 24) +
                            (specularColor.r << 16) +
                            (specularColor.g << 8) +
                            specularColor.b
                        )
                            .toString(16)
                            .slice(1)}`;
                        rValueSpecular.value = specularColor.r.toString();
                        gValueSpecular.value = specularColor.g.toString();
                        bValueSpecular.value = specularColor.b.toString();

                        shininess.value = material.getShininess().toString();
                    }

                    if (material instanceof PhongMaterial) {
                        displacementScale.value = material
                            .getDisplacementScale()
                            .toString();
                        displacementBias.value = material
                            .getDisplacementBias()
                            .toString();
                    }

                    if (material instanceof ParallaxMaterial) {
                        heightTexture.value = material
                            .getHeightTextureType()
                            .toString();
                        heightScale.value = material
                            .getHeightScale()
                            .toString();
                    }
                }
                const fps = container.getElement("fps") as HTMLInputElement;
                const fpsSlider = container.getElement(
                    "fpsSlider"
                ) as HTMLInputElement;
                fps.value = "10";
                fpsSlider.value = "10";
            },
        });
        container.addElement("#componentTree", button);

        treeNode.children.forEach((childNode) =>
            Tree.mapTreeToComponentTree(container, childNode, variables)
        );
    }
}
