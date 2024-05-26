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
        return {
            r: Math.round(this.r * 255),
            g: Math.round(this.g * 255),
            b: Math.round(this.b * 255),
        };
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

    public static get WHITE(): Color {
        return new Color(1, 1, 1);
    }

    public static get RED(): Color {
        return new Color(1, 0, 0);
    }

    public static get GREEN(): Color {
        return new Color(0, 1, 0);
    }

    public static get BLUE(): Color {
        return new Color(0, 0, 1);
    }

    public static get BLACK(): Color {
        return new Color(0, 0, 0);
    }

    public static get DARKGREEN(): Color {
        return new Color(0, 0.25, 0.07);
    }

    public static get SLIMEGREEN(): Color {
        return new Color(119 / 255, 191 / 255, 99 / 255);
    }

    public static get SLIMEGRAY(): Color {
        return new Color(70 / 255, 115 / 255, 57 / 255);
    }

    public static get SLIMMEDARKGREEN(): Color {
        return new Color(82 / 255, 140 / 255, 66 / 250);
    }

    static fromArray(u_diffuseColor: number[]) {
        return new Color(
            u_diffuseColor[0],
            u_diffuseColor[1],
            u_diffuseColor[2]
        );
    }
}
