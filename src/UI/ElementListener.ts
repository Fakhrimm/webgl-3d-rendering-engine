import {Variables} from "./Variables";

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
        variables.getTree().reference.setRotationX(val);
    });
    rotateY.addEventListener("input", () => {
        const val = rotateY.valueAsNumber;
        console.log("Y", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setRotationY(val);
    });
    rotateZ.addEventListener("input", () => {
        const val = rotateZ.valueAsNumber;
        console.log("Z", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setRotationZ(val);
    });

    const scaleX = container.getElement("scaleX") as HTMLInputElement;
    const scaleY = container.getElement("scaleY") as HTMLInputElement;
    const scaleZ = container.getElement("scaleZ") as HTMLInputElement;

    scaleX.addEventListener("input", () => {
        const val = scaleX.valueAsNumber;
        console.log("X", val);
        console.log(variables.getTree());
        variables.getTree().reference.setScaleX(val)
    });
    scaleY.addEventListener("input", () => {
        const val = scaleY.valueAsNumber;
        console.log("Y", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScaleY(val);
    });
    scaleZ.addEventListener("input", () => {
        const val = scaleZ.valueAsNumber;
        console.log("Z", val);
        // console.log(variables.getTree());
        variables.getTree().reference.setScaleZ(val);
    });

    const translateX = container.getElement("translateX") as HTMLInputElement;
    const translateY = container.getElement("translateY") as HTMLInputElement;
    const translateZ = container.getElement("translateZ") as HTMLInputElement;

    translateX.addEventListener("input", () => {
        const val = translateX.valueAsNumber;
        console.log("X", val);
        console.log(variables.getTree());
        variables.getTree().reference.setPositionX(val);
    });
    translateY.addEventListener("input", () => {
        const val = translateY.valueAsNumber;
        console.log("Y", val);
        console.log(variables.getTree());
        variables.getTree().reference.setPositionY(val);
    });
    translateZ.addEventListener("input", () => {
        const val = translateZ.valueAsNumber;
        console.log("Z", val);
        console.log(variables.getTree());
        variables.getTree().reference.setPositionZ(val);
    });

}
