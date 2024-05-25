import { clamp } from "./math-util.ts";

export class Color {
    private r: number;
    private g: number;
    private b: number;

    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    set(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get(): number[] {
        return [this.r, this.g, this.b];
    }

    getFromRGB(): { r: number; g: number; b: number } {
        return { r: this.r, g: this.g, b: this.b };
    }

    setFromRGB(r: number, g: number, b: number) {
        r = clamp(r, 0, 255);
        g = clamp(g, 0, 255);
        b = clamp(b, 0, 255);
        r /= 255;
        g /= 255;
        b /= 255;
        this.set(r, g, b);
    }

    public static WHITE = new Color(1, 1, 1);
    public static RED = new Color(1, 0, 0);
    public static GREEN = new Color(0, 1, 0);
    public static BLUE = new Color(0, 0, 1);
    public static BLACK = new Color(0, 0, 0);
}
