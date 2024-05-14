export class Container {
    private elementRefs: Map<string, HTMLElement> = new Map();
    private canvas: HTMLCanvasElement | null = null;
    private model: HTMLSelectElement | null = null;

    constructor() {
        // TOP
        const loadFile = document.getElementById("loadFile");
        const saveFile = document.getElementById("saveFile");
        const help = document.getElementById("help");

        const modalContainer = document.getElementById("modalContainer");
        const modalBackdrop = document.getElementById("modalBackdrop");

        // LEFT
        const model = document.getElementById("model");

        const camera = document.querySelector("#camera");

        const zoomIn = document.querySelector("#zoomIn");
        const zoomOut = document.querySelector("#zoomOut");

        const shader = document.querySelector("#shader");
        const reset = document.querySelector("#reset");

        const orthographic = document.querySelector("#orthographic");
        const perspective = document.querySelector("#perspective");
        const oblique = document.querySelector("#oblique");

        // CENTER
        const canvas = document.querySelector("#canvas");

        // RIGHT
        const activeComponent = document.getElementById("activeComponent");

        const rotateX = document.getElementById("rotateX");
        const rotateY = document.getElementById("rotateY");
        const rotateZ = document.getElementById("rotateZ");

        const scaleX = document.getElementById("scaleX");
        const scaleY = document.getElementById("scaleY");
        const scaleZ = document.getElementById("scaleZ");

        const translateX = document.getElementById("translateX");
        const translateY = document.getElementById("translateY");
        const translateZ = document.getElementById("translateZ");

        const bump = document.getElementById("bump");
        const image = document.getElementById("environment");
        const reflective = document.getElementById("reflective");
        const none = document.getElementById("none");

        const play = document.getElementById("play");
        const pause = document.getElementById("pause");
        const reverse = document.getElementById("reverse");
        const autoPlay = document.getElementById("autoPlay");
        const next = document.getElementById("next");
        const prev = document.getElementById("prev");
        const first = document.getElementById("first");
        const last = document.getElementById("last");

        const saveFrame = document.getElementById("saveFrame");
        const deleteFrame = document.getElementById("deleteFrame");

        this.canvas = canvas as HTMLCanvasElement;
        this.model = model as HTMLSelectElement;

        this.elementRefs.set("loadFile", loadFile as HTMLElement);
        this.elementRefs.set("saveFile", saveFile as HTMLElement);
        this.elementRefs.set("help", help as HTMLElement);
        this.elementRefs.set("modalContainer", modalContainer as HTMLElement);
        this.elementRefs.set("modalBackdrop", modalBackdrop as HTMLElement);
        this.elementRefs.set("camera", camera as HTMLElement);
        this.elementRefs.set("zoomIn", zoomIn as HTMLElement);
        this.elementRefs.set("zoomOut", zoomOut as HTMLElement);
        this.elementRefs.set("shader", shader as HTMLElement);
        this.elementRefs.set("reset", reset as HTMLElement);
        this.elementRefs.set("orthographic", orthographic as HTMLElement);
        this.elementRefs.set("perspective", perspective as HTMLElement);
        this.elementRefs.set("oblique", oblique as HTMLElement);
        this.elementRefs.set("canvas", canvas as HTMLElement);
        this.elementRefs.set("model", model as HTMLElement);
        this.elementRefs.set("activeComponent", activeComponent as HTMLElement);
        this.elementRefs.set("rotateX", rotateX as HTMLElement);
        this.elementRefs.set("rotateY", rotateY as HTMLElement);
        this.elementRefs.set("rotateZ", rotateZ as HTMLElement);
        this.elementRefs.set("scaleX", scaleX as HTMLElement);
        this.elementRefs.set("scaleY", scaleY as HTMLElement);
        this.elementRefs.set("scaleZ", scaleZ as HTMLElement);
        this.elementRefs.set("translateX", translateX as HTMLElement);
        this.elementRefs.set("translateY", translateY as HTMLElement);
        this.elementRefs.set("translateZ", translateZ as HTMLElement);
        this.elementRefs.set("bump", bump as HTMLElement);
        this.elementRefs.set("environment", image as HTMLElement);
        this.elementRefs.set("reflective", reflective as HTMLElement);
        this.elementRefs.set("none", none as HTMLElement);
        this.elementRefs.set("play", play as HTMLElement);
        this.elementRefs.set("pause", pause as HTMLElement);
        this.elementRefs.set("reverse", reverse as HTMLElement);
        this.elementRefs.set("autoPlay", autoPlay as HTMLElement);
        this.elementRefs.set("next", next as HTMLElement);
        this.elementRefs.set("prev", prev as HTMLElement);
        this.elementRefs.set("first", first as HTMLElement);
        this.elementRefs.set("last", last as HTMLElement);
        this.elementRefs.set("saveFrame", saveFrame as HTMLElement);
        this.elementRefs.set("deleteFrame", deleteFrame as HTMLElement);
    }

    public getElement(id: string): HTMLElement {
        const element = this.elementRefs.get(id);
        if (!element) {
            throw new Error(`Element with ID '${id}' not found`);
        }
        return element;
    }

    public addElement(parentSelector: string, element: HTMLElement) {
        const parent = document.querySelector(parentSelector);
        parent?.appendChild(element);
    }

    public addButton(props: {
        id: string;
        depth: number;
        onClick: () => void;
    }) {
        const { id, depth, onClick } = props;
        const button = document.createElement("button");
        button.id = id;
        button.className = `ml-${
            depth * 8
        } mt-2 w-1/3 flex flex-col items-center py-1 px-8 
            bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none 
            focus:ring-green-300 text-white font-semibold rounded-lg 
            shadow-md transition duration-300 ease-in-out transform 
            hover:scale-105 active:scale-95`;
        button.innerHTML = id;
        button.onclick = () => {
            onClick();
        };
        return button;
    }

    public addSlider(
        id: string,
        sliderId: string,
        min: number,
        max: number,
        value: number,
        onChange: (value: number) => void
    ): void {
        const parent = this.getElement(id);
        const slider = document.createElement("input");
        slider.type = "range";
        slider.id = sliderId;
        slider.min = String(min);
        slider.max = String(max);
        slider.value = String(value);
        slider.oninput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            onChange(Number(target.value));
        };
        parent.appendChild(slider);
        this.elementRefs.set(sliderId, slider);
    }

    public clearComponent(selector: string) {
        const elmt = document.querySelector(selector);
        if (!elmt) {
            throw new Error("No element found");
        }
        elmt.innerHTML = "";
    }
}
