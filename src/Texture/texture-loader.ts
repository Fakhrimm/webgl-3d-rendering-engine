import {TextureTypes} from "../Types/texture-types.ts";

export class TextureLoader {
    private textures: WebGLTexture[] = [];
    private readonly texturePath : {[key in TextureTypes]: string} = {
        [TextureTypes.DIFFUSE_DEFAULT]: "../Assets/diffuse-default.jpeg",
        [TextureTypes.DIFFUSE_1]: "../Assets/diffuse-1.jpg",
        [TextureTypes.DIFFUSE_2]: "../Assets/diffuse-2.jpg",
        [TextureTypes.DIFFUSE_3]: "../Assets/diffuse-3.jpeg",
    };

    async loadTexture(gl: WebGLRenderingContext) {
        for (const [key, path] of Object.entries(this.texturePath)) {
            try {
                const image = await this.loadImage(path);

                const textureType = parseInt(key) as TextureTypes;
                const texture = gl.createTexture();
                if (!texture) {
                    throw new Error("Failed to create texture");
                }
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }

                this.textures[textureType] = texture;
            } catch (error) {
                console.error(error);
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, null)
        return this.textures;
    }

    private loadImage(path: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                resolve(image);
            };
            image.onerror = (error) => {
                reject(error);
            }
            image.src = path;
        });
    }

    public getTexture(textureType: TextureTypes) {
        return this.textures[textureType];
    }

    private isPowerOf2(value: number) {
        return (value & (value - 1)) == 0;
    }
}