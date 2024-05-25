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
                rotateX.value = (rotation.x / (Math.PI * 1.5)).toFixed(2);
                rotateY.value = (rotation.y / (Math.PI * 1.5)).toFixed(2);
                rotateZ.value = (rotation.z / (Math.PI * 1.5)).toFixed(2);

                const scale = activeComponent.getScale();
                scaleX.value = scale.x.toFixed(2);
                scaleY.value = scale.y.toFixed(2);
                scaleZ.value = scale.z.toFixed(2);

                const position = activeComponent.getPosition();
                const canvasWidth = variables.getWebGL().canvas.width;
                const canvasHeight = variables.getWebGL().canvas.height;

                translateX.value = (
                    ((position.x + canvasWidth / 2) / canvasWidth) * 6.6 -
                    3.3
                ).toFixed(2);
                translateY.value = (
                    ((position.y + canvasHeight / 2) / canvasHeight) * 6.6 -
                    3.3
                ).toFixed(2);
                translateZ.value = (position.z / 5).toFixed(2);
            },
        });
        container.addElement("#componentTree", button);

        treeNode.children.forEach((childNode) =>
            Tree.mapTreeToComponentTree(container, childNode, variables)
        );
    }
}
