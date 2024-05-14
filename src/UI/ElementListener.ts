import { Vector3 } from "../Math/vector-3";
import { Container } from "./Container";
import { Variables } from "./Variables";

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

    // RIGHT
    const rotateX = container.getElement("rotateX") as HTMLInputElement;
    const rotateY = container.getElement("rotateY") as HTMLInputElement;
    const rotateZ = container.getElement("rotateZ") as HTMLInputElement;

    rotateX.addEventListener("input", () => {
        const val = rotateX.valueAsNumber;
        console.log("X", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ x: val });
    });
    rotateY.addEventListener("input", () => {
        const val = rotateY.valueAsNumber;
        console.log("Y", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ y: val });
    });
    rotateZ.addEventListener("input", () => {
        const val = rotateZ.valueAsNumber;
        console.log("Z", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ z: val });
    });

    const scaleX = container.getElement("scaleX") as HTMLInputElement;
    const scaleY = container.getElement("scaleY") as HTMLInputElement;
    const scaleZ = container.getElement("scaleZ") as HTMLInputElement;

    scaleX.addEventListener("input", () => {
        const val = scaleX.valueAsNumber;
        console.log("X", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ x: val });
    });
    scaleY.addEventListener("input", () => {
        const val = scaleY.valueAsNumber;
        console.log("Y", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ y: val });
    });
    scaleZ.addEventListener("input", () => {
        const val = scaleZ.valueAsNumber;
        console.log("Z", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScale({ z: val });
    });

    const translateX = container.getElement("translateX") as HTMLInputElement;
    const translateY = container.getElement("translateY") as HTMLInputElement;
    const translateZ = container.getElement("translateZ") as HTMLInputElement;

    translateX.addEventListener("input", () => {
        const val = translateX.valueAsNumber;
        console.log("X", val);
        console.log(variables.getTree());
        variables.getTree().reference.setTranslate({ x: val });
    });
    translateY.addEventListener("input", () => {
        const val = translateY.valueAsNumber;
        console.log("Y", val);
        console.log(variables.getTree());
        variables.getTree().reference.setTranslate({ y: val });
    });
    translateZ.addEventListener("input", () => {
        const val = translateZ.valueAsNumber;
        console.log("Z", val);
        console.log(variables.getTree());
        variables.getTree().reference.setTranslate({ z: val });
    });

}
