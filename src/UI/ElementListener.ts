import { BasicMaterial } from "../Material/basic-material";
import { Variables } from "./Variables";
import { Mesh } from "../Object/mesh.ts";
import { PhongMaterial } from "../Material/phong-material.ts";
import { SaveLoader } from "../Utils/save-loader.ts";
import { OrthographicCamera } from "../Camera/orthographic-camera.ts";
import { PerspectiveCamera } from "../Camera/perspective-camera.ts";
import { ObliqueCamera } from "../Camera/oblique-camera.ts";
import { AnimationRunner } from "../Animation/animationRunner.ts";
import { Tree } from "./Tree.ts";
import { renderScene } from "../main.ts";

export function elementListner(variables: Variables) {
    const container = variables.getContainer();

    // Utility Function
    function showError(message: string) {
        errorMessage.textContent = message;
        errorPopup.classList.remove("hidden");
    }

    function getSelectedNode() {
        return variables.getScene();
    }

    function getOriginNode() {
        return variables.getOriginNode();
    }

    // TOP
    const help = container.getElement("help");
    const modalContainer = container.getElement("modalContainer");
    const modalBackdrop = container.getElement("modalBackdrop");

    help.addEventListener("click", () => {
        modalContainer.style.display = "block";
    });

    modalBackdrop.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    const saveFile = container.getElement("saveFile");
    const loadFile = container.getElement("loadFile") as HTMLInputElement;

    saveFile.addEventListener("click", () => {
        SaveLoader.saveModel(variables.getScene(), "pixar.json");
    });

    loadFile.addEventListener("change", () => {
        const file = loadFile.files?.[0];
        if (!file) {
            return;
        }
        console.log(file);
        SaveLoader.loadModel(file, (model) => {
            try {
                console.log("YESS");
                Tree.resetTree(container);
                variables.setScene(model);
                const tree = Tree.mapSceneToTree(variables.getScene());
                console.log("TREE", tree);
                Tree.mapTreeToComponentTree(container, tree, variables);
                container.getElement("activeComponent").innerHTML = tree.name;
                requestAnimationFrame(() =>
                    renderScene(variables.getWebGL(), variables, false)
                );
            } catch (error) {
                throw new Error(`Failed to load model: ${error}`);
            }
        });
    });

    // LEFT
    let rotateAxis = "x";
    let previousValue = 0;

    const rotateAxisDropdown = container.getElement(
        "rotateAxis"
    ) as HTMLInputElement;
    const cameraSlider = container.getElement(
        "camera"
    ) as HTMLInputElement | null;
    if (!rotateAxisDropdown || !cameraSlider) {
        console.error("One or more elements not found in the DOM");
        return;
    }

    rotateAxisDropdown.addEventListener("change", () => {
        rotateAxis = rotateAxisDropdown.value;
        previousValue = 0;
        console.log(`Axis changed to: ${rotateAxis}`);
    });

    cameraSlider.addEventListener("input", () => {
        const val = cameraSlider.valueAsNumber;
        const degrees = (val / 3.3) * 180;
        const radians = degrees * (Math.PI / 180);
        if (rotateAxis === "x") {
            variables.getOriginNode().setRotationX(radians);
        } else if (rotateAxis === "y") {
            variables.getOriginNode().setRotationY(radians);
        }
    });

    let radius = getSelectedNode().getActiveCamera()?.getZoom() ?? 0;
    const zoomIn = container.getElement("zoomIn");
    zoomIn.addEventListener("click", () => {
        radius += 0.5;
        console.log("Current radius:", radius);
        getSelectedNode().setActiveCameraZoom(radius);
    });
    const zoomOut = container.getElement("zoomOut");
    zoomOut.addEventListener("click", () => {
        radius -= 0.5;
        console.log("Current radius:", radius);
        getSelectedNode().setActiveCameraZoom(radius);
    });

    const shader = container.getElement("shader") as HTMLInputElement;
    shader.addEventListener("change", (event) => {
        const isChecked = (event.target as HTMLInputElement).checked;
        const selectedNode = variables.getTree().reference;
        if (selectedNode instanceof Mesh) {
            if (isChecked) {
                selectedNode.geometry.setToSmoothShading();
            } else {
                selectedNode.geometry.setToFlatShading();
            }
        }
    });

    const cameraButtons = [
        { id: "orthographic", camera: OrthographicCamera },
        { id: "perspective", camera: PerspectiveCamera },
        { id: "oblique", camera: ObliqueCamera },
    ];

    cameraButtons.forEach((button) => {
        const element = container.getElement(button.id);
        element.addEventListener("click", () => {
            getSelectedNode().setActiveCamera(button.camera);
            console.log("YES");
            console.log(getOriginNode());
            console.log("YES");
        });
    });

    const reset = container.getElement("reset");
    reset.addEventListener("click", () => {
        getSelectedNode().setActiveCameraToDefault();
    });

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
    const shininess = container.getElement("shininess") as HTMLInputElement;
    const errorPopup = container.getElement("errorPopup") as HTMLInputElement;
    const errorMessage = container.getElement(
        "errorMessage"
    ) as HTMLInputElement;
    const closeErrorPopup = container.getElement(
        "closeErrorPopup"
    ) as HTMLInputElement;

    closeErrorPopup.addEventListener("click", () => {
        errorPopup.classList.add("hidden");
    });

    let previousDiffuseColor = colorPickerDiffuse.value;
    let previousRValueDiffuse = rValueDiffuse.value;
    let previousGValueDiffuse = gValueDiffuse.value;
    let previousBValueDiffuse = bValueDiffuse.value;

    colorPickerDiffuse.addEventListener("input", (event) => {
        const color = (event.target as HTMLInputElement).value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        rValueDiffuse.value = r.toString();
        gValueDiffuse.value = g.toString();
        bValueDiffuse.value = b.toString();

        const selectedNode = variables.getTree().reference;

        try {
            if (selectedNode instanceof Mesh) {
                const material = selectedNode.material;
                if (
                    material instanceof BasicMaterial ||
                    material instanceof PhongMaterial
                ) {
                    material.setDiffuseColorFromRGB(r, g, b);
                    previousDiffuseColor = color;
                } else {
                    throw new Error(
                        "Only Mesh with BasicMaterial or PhongMaterial can access this function."
                    );
                }
            } else {
                throw new Error("Only Mesh can access this function.");
            }
        } catch (error) {
            showError(String(error));
            colorPickerDiffuse.value = previousDiffuseColor;
            rValueDiffuse.value = previousRValueDiffuse;
            gValueDiffuse.value = previousGValueDiffuse;
            bValueDiffuse.value = previousBValueDiffuse;
        }
    });

    let previousSpecularColor = colorPickerSpecular.value;
    let previousRValueSpecular = rValueSpecular.value;
    let previousGValueSpecular = gValueSpecular.value;
    let previousBValueSpecular = bValueSpecular.value;

    colorPickerSpecular.addEventListener("input", (event) => {
        const color = (event.target as HTMLInputElement).value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        rValueSpecular.value = r.toString();
        gValueSpecular.value = g.toString();
        bValueSpecular.value = b.toString();

        const selectedNode = variables.getTree().reference;

        try {
            if (selectedNode instanceof Mesh) {
                const material = selectedNode.material;
                if (material instanceof PhongMaterial) {
                    material.setSpecularColorFromRGB(r, g, b);
                    previousSpecularColor = color;
                } else {
                    throw new Error(
                        "Only Mesh with PhongMaterial can access this function."
                    );
                }
            } else {
                throw new Error("Only Mesh can access this function.");
            }
        } catch (error) {
            showError(String(error));
            colorPickerSpecular.value = previousSpecularColor;
            rValueSpecular.value = previousRValueSpecular;
            gValueSpecular.value = previousGValueSpecular;
            bValueSpecular.value = previousBValueSpecular;
        }
    });

    let previousShininess = shininess.value;
    shininess.addEventListener("input", (event) => {
        const value = Number((event.target as HTMLInputElement).value);
        const selectedNode = variables.getTree().reference;
        try {
            if (selectedNode instanceof Mesh) {
                const material = selectedNode.material;
                if (material instanceof PhongMaterial) {
                    material.setShininess(value);
                    previousShininess = value.toString();
                } else {
                    throw new Error(
                        "Only Mesh with PhongMaterial can access this function."
                    );
                }
            } else {
                throw new Error("Only Mesh can access this function.");
            }
        } catch (error) {
            showError(String(error));
            shininess.value = previousShininess;
        }
    });

    // RIGHT
    const rotateX = container.getElement("rotateX") as HTMLInputElement;
    const rotateY = container.getElement("rotateY") as HTMLInputElement;
    const rotateZ = container.getElement("rotateZ") as HTMLInputElement;

    rotateX.addEventListener("input", () => {
        const val = rotateX.valueAsNumber;
        variables.getTree().reference.setRotationX(val * Math.PI * 1.5);
    });
    rotateY.addEventListener("input", () => {
        const val = rotateY.valueAsNumber;
        variables.getTree().reference.setRotationY(val * Math.PI * 1.5);
    });
    rotateZ.addEventListener("input", () => {
        const val = rotateZ.valueAsNumber;
        variables.getTree().reference.setRotationZ(val * Math.PI * 1.5);
    });

    const scaleX = container.getElement("scaleX") as HTMLInputElement;
    const scaleY = container.getElement("scaleY") as HTMLInputElement;
    const scaleZ = container.getElement("scaleZ") as HTMLInputElement;

    scaleX.addEventListener("input", () => {
        const val = scaleX.valueAsNumber;
        variables.getTree().reference.setScaleX(val);
    });
    scaleY.addEventListener("input", () => {
        const val = scaleY.valueAsNumber;
        variables.getTree().reference.setScaleY(val);
    });
    scaleZ.addEventListener("input", () => {
        const val = scaleZ.valueAsNumber;
        variables.getTree().reference.setScaleZ(val);
    });

    const translateX = container.getElement("translateX") as HTMLInputElement;
    const translateY = container.getElement("translateY") as HTMLInputElement;
    const translateZ = container.getElement("translateZ") as HTMLInputElement;

    translateX.addEventListener("input", () => {
        const val = translateX.valueAsNumber;
        const canvasWidth = variables.getWebGL().canvas.width;
        const min = parseFloat(translateX.min);
        const max = parseFloat(translateX.max);
        const normalizedVal =
            ((val - min) / (max - min)) * canvasWidth - canvasWidth / 2;
        variables.getTree().reference.setPositionX(normalizedVal);
    });
    translateY.addEventListener("input", () => {
        const val = translateY.valueAsNumber;
        const canvasHeight = variables.getWebGL().canvas.height;
        const min = parseFloat(translateY.min);
        const max = parseFloat(translateY.max);
        const normalizedVal =
            ((val - min) / (max - min)) * canvasHeight - canvasHeight / 2;
        variables.getTree().reference.setPositionY(normalizedVal);
    });
    translateZ.addEventListener("input", () => {
        const val = translateZ.valueAsNumber;
        variables.getTree().reference.setPositionZ(val * 5);
    });

    // ANIMATION
    let lastFrameTime: number | undefined;
    const animationRunner = new AnimationRunner(
        "../Animation/Animations/boxspin.json",
        variables.getTree().reference,
        variables
    );

    const play = container.getElement("play") as HTMLInputElement;
    const pause = container.getElement("pause") as HTMLInputElement;
    const reverse = container.getElement("reverse") as HTMLInputElement;
    const autoPlay = container.getElement("autoPlay") as HTMLInputElement;
    const next = container.getElement("next") as HTMLInputElement;
    const prev = container.getElement("prev") as HTMLInputElement;
    const first = container.getElement("first") as HTMLInputElement;
    const last = container.getElement("last") as HTMLInputElement;

    play.addEventListener("click", () => {
        animationRunner.play();

        function runAnim(currentTime: number) {
            if (lastFrameTime === undefined) lastFrameTime = currentTime;
            const deltaSecond = (currentTime - lastFrameTime) / 1000;
            try {
                animationRunner.update(deltaSecond);
            } catch (error) {
                showError(String(error));
                animationRunner.pause();
                colorPickerDiffuse.value = previousDiffuseColor;
                rValueDiffuse.value = previousRValueDiffuse;
                gValueDiffuse.value = previousGValueDiffuse;
                bValueDiffuse.value = previousBValueDiffuse;
            }
            lastFrameTime = currentTime;
            requestAnimationFrame(runAnim);
        }
        requestAnimationFrame(runAnim);
    });

    pause.addEventListener("click", () => {
        animationRunner.pause();
    });

    reverse.addEventListener("click", () => {
        animationRunner.reverse();
    });

    autoPlay.addEventListener("click", () => {
        animationRunner.auto();
    });

    next.addEventListener("click", () => {
        animationRunner.nextFrame();
    });

    prev.addEventListener("click", () => {
        animationRunner.prevFrame();
    });

    first.addEventListener("click", () => {
        animationRunner.first();
    });

    last.addEventListener("click", () => {
        animationRunner.last();
    });
}
