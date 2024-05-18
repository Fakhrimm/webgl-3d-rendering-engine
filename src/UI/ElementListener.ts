import {BasicMaterial} from "../Material/basic-material";
import {Variables} from "./Variables";
import {Mesh} from "../Object/mesh.ts";
import {PhongMaterial} from "../Material/phong-material.ts";
import { SaveLoader } from "../Utils/save-loader.ts";

export function elementListner(variables: Variables) {
    const container = variables.getContainer();
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
    const loadFile = container.getElement("loadFile");

    saveFile.addEventListener("click", () => {
        SaveLoader.saveModel(variables.getScene(), "pixar.json");
    });

    loadFile.addEventListener("click", () => {
        // To Do Set Scene from loaded scene
        SaveLoader.loadModel();
    });

    // LEFT
    const shader = container.getElement("shader") as HTMLInputElement;

    shader.addEventListener("change", (event) => {
        // Your code to handle the checkbox state change goes here
        const isChecked = (event.target as HTMLInputElement).checked;
        console.log("Checkbox is checked:", isChecked);

        const selectedNode = variables.getTree().reference;
        if (selectedNode instanceof Mesh) {
            if (isChecked) {
                console.log("SMOOTH");
                selectedNode.geometry.setToSmoothShading();
            } else {
                console.log("FLAT");
                selectedNode.geometry.setToFlatShading();
            }
        }
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

    function showError(message: string) {
        errorMessage.textContent = message;
        errorPopup.classList.remove("hidden");
    }

    colorPickerDiffuse.addEventListener("input", (event) => {
        const color = (event.target as HTMLInputElement).value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        rValueDiffuse.value = r.toString();
        gValueDiffuse.value = g.toString();
        bValueDiffuse.value = b.toString();

        const selectedNode = variables.getTree().reference;

        if (selectedNode instanceof Mesh) {
            const material = selectedNode.material;
            if (
                material instanceof BasicMaterial ||
                material instanceof PhongMaterial
            ) {
                material.setDiffuseColorFromRGB(r, g, b);
            }
        }
    });

    colorPickerSpecular.addEventListener("input", (event) => {
        const color = (event.target as HTMLInputElement).value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        rValueSpecular.value = r.toString();
        gValueSpecular.value = g.toString();
        bValueSpecular.value = b.toString();

        const selectedNode = variables.getTree().reference;

        if (selectedNode instanceof Mesh) {
            const material = selectedNode.material;
            if (material instanceof PhongMaterial) {
                console.log("PHONG");
                material.setSpecularColorFromRGB(r, g, b);
            } else {
                showError(
                    "Error: Only PhongMaterial can access this function."
                );
            }
        }

        console.log(selectedNode);
        console.log(color);
    });

    shininess.addEventListener("input", (event) => {
        const value = Number((event.target as HTMLInputElement).value);
        const selectedNode = variables.getTree().reference;
        if (selectedNode instanceof Mesh) {
            const material = selectedNode.material;
            if (material instanceof PhongMaterial) {
                material.setShininess(value);
            } else {
                showError(
                    "Error: Only PhongMaterial can access this function."
                );
            }
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

    const play = container.getElement("play") as HTMLInputElement;
    const pause = container.getElement("pause") as HTMLInputElement;
    const reverse = container.getElement("reverse") as HTMLInputElement;
    const autoPlay = container.getElement("autoPlay") as HTMLInputElement;
    const next = container.getElement("next") as HTMLInputElement;
    const prev = container.getElement("prev") as HTMLInputElement;
    const first = container.getElement("first") as HTMLInputElement;
    const last = container.getElement("last") as HTMLInputElement;
}
