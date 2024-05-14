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

        console.log("");
        console.log("");
        console.log("CESSKU");
        console.log(scene);
        console.log(level);
        console.log("CESSKU");
        console.log(treeNode);
        console.log("");
        console.log("");
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
                variables.setTree(treeNode);
                container.getElement("activeComponent").innerHTML =
                    treeNode.name;
            },
        });
        container.addElement("#componentTree", button);

        treeNode.children.forEach((childNode) =>
            Tree.mapTreeToComponentTree(container, childNode, variables)
        );
    }
}
