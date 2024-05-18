import {BasicMaterial} from "../Material/basic-material";
import {Variables} from "./Variables";
import {Mesh} from "../Object/mesh.ts";
import {PhongMaterial} from "../Material/phong-material.ts";

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

    saveFile.addEventListener("click", () => {});

    // LEFT
    const colorPicker = container.getElement("colorPicker") as HTMLInputElement;
    const rValue = container.getElement("rValue") as HTMLInputElement;
    const gValue = container.getElement("gValue") as HTMLInputElement;
    const bValue = container.getElement("bValue") as HTMLInputElement;
    const hexValue = container.getElement("hexValue") as HTMLInputElement;

    colorPicker.addEventListener("input", (event) => {
        const color = (event.target as HTMLInputElement).value;
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const hex = color.toUpperCase();
        rValue.value = r.toString();
        gValue.value = g.toString();
        bValue.value = b.toString();
        hexValue.value = hex;

        const selectedNode = variables.getTree().reference;

        if (selectedNode instanceof Mesh) {
            const material = selectedNode.material;
            if (material instanceof BasicMaterial) {
                material.setDiffuseColorFromRGB(r, g, b);
            } else if (material instanceof PhongMaterial) {

            }
        }

        console.log(selectedNode);
        console.log(color);
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
