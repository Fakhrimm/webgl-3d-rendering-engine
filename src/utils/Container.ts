export class Container {
    private elementRefs: Map<string, HTMLElement> = new Map();

    constructor(private ids: string[]) {
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Element with ID '${id}' not found`);
            }
            this.elementRefs.set(id, element);
        });
    }

    public getElement(id: string): HTMLElement {
        const element = this.elementRefs.get(id);
        if (!element) {
            throw new Error(`Element with ID '${id}' not found`);
        }
        return element;
    }

    public addButton(parentId: string, buttonId: string, onClick: () => void): void {
        const parent = this.getElement(parentId);
        const button = document.createElement('button');
        button.id = buttonId;
        button.textContent = buttonId;
        button.onclick = onClick;
        parent.appendChild(button);
        this.elementRefs.set(buttonId, button);
    }

    public addSlider(parentId: string, sliderId: string, min: number, max: number, value: number, onChange: (value: number) => void): void {
        const parent = this.getElement(parentId);
        const slider = document.createElement('input');
        slider.type = 'range';
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
        const toast = document.createElement('div');
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
        parent.innerHTML = '';
    }
}