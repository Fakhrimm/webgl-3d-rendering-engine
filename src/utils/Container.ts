export class Container {
  private elementRefs: Map<string, HTMLElement> = new Map();
  private canvas: HTMLCanvasElement | null = null;
  private selectModel: HTMLSelectElement | null = null;

  constructor() {
    // TOP
    const loadFile = document.getElementById("loadFile");
    const saveFile = document.getElementById("saveFile");
    const help = document.getElementById("help");

    const modalContainer = document.getElementById("modalContainer");
    const modalBackdrop = document.getElementById("modalBackdrop");

    // LEFT
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
    const selectModel = document.getElementById("model");

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
    this.selectModel = selectModel as HTMLSelectElement;

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
    this.elementRefs.set("model", selectModel as HTMLElement);
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

  public addButton(
    parentId: string,
    buttonId: string,
    onClick: () => void
  ): void {
    const parent = this.getElement(parentId);
    const button = document.createElement("button");
    button.id = buttonId;
    button.textContent = buttonId;
    button.onclick = onClick;
    parent.appendChild(button);
    this.elementRefs.set(buttonId, button);
  }

  public addSlider(
    parentId: string,
    sliderId: string,
    min: number,
    max: number,
    value: number,
    onChange: (value: number) => void
  ): void {
    const parent = this.getElement(parentId);
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

  public showWarningToast(message: string): void {
    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement("div");
    toast.id = toastId;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      const toastElement = document.getElementById(toastId);
      if (toastElement) {
        toastElement.remove();
      }
    }, 5000);
  }

  public clearParent(parentId: string): void {
    const parent = this.getElement(parentId);
    parent.innerHTML = "";
  }
}
