import {TextureTypes} from "../Types/texture-types.ts";

export class TextureLoader {
    private readonly texturePath : {[key in TextureTypes]: string} = {
        [TextureTypes.DIFFUSE_0]: "../Assets/diffuse-default.png",
        [TextureTypes.DIFFUSE_1]: "../Assets/diffuse-1.png",
        [TextureTypes.DIFFUSE_2]: "../Assets/diffuse-2.jpeg",
        [TextureTypes.DIFFUSE_3]: "../Assets/diffuse-3.jpeg",
        [TextureTypes.DIFFUSE_BRICKS]: "../Assets/diffuse_brick.png",
        [TextureTypes.DIFFUSE_WOOD]: "../Assets/diffuse_wood.PNG",
        [TextureTypes.SPECULAR_0]: "../Assets/specular-default.png",
        [TextureTypes.SPECULAR_1]: "../Assets/specular-1.png",
        [TextureTypes.SPECULAR_2]: "../Assets/specular-2.jpeg",
        [TextureTypes.SPECULAR_3]: "../Assets/specular-3.jpeg",
        [TextureTypes.NORMAL_0]: "../Assets/normal-default.png",
        [TextureTypes.NORMAL_1]: "../Assets/normal-1.png",
        [TextureTypes.NORMAL_2]: "../Assets/normal-2.jpeg",
        [TextureTypes.NORMAL_3]: "../Assets/normal-3.jpeg",
        [TextureTypes.NORMAL_BRICKS]: "../Assets/normal_brick.png",
        [TextureTypes.NORMAL_WOOD]: "../Assets/normal_wood.png",
        [TextureTypes.DISPLACEMENT_0]: "../Assets/displacement-default.png",
        [TextureTypes.DISPLACEMENT_1]: "../Assets/displacement-1.png",
        [TextureTypes.DISPLACEMENT_2]: "../Assets/displacement-2.jpg",
        [TextureTypes.HEIGHT_0]: "../Assets/height-default.png",
        [TextureTypes.HEIGHT_BRICKS]: "../Assets/height_brick.png",
        [TextureTypes.HEIGHT_WOOD]: "../Assets/height_wood.png",
    };

    public loadTexture(gl: WebGLRenderingContext, textures: WebGLTexture[] = []) {
        for (const [key, path] of Object.entries(this.texturePath)) {
            try {
                const image = new Image()
                image.src = path;
                image.onload = () => {
                    // const image = await this.loadImage(path);

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
                    textures[textureType] = texture;
                }
            } catch (error) {
                console.error(error);
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    public loadDefaultTexture(gl: WebGLRenderingContext) {
        const textures: WebGLTexture[] = [];
        for (const [key] of Object.entries(this.texturePath)) {
            try {
                const textureType = parseInt(key) as TextureTypes;
                const texture = gl.createTexture();
                if (!texture) {
                    throw new Error("Failed to create texture");
                }
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));

                textures[textureType] = texture;
            } catch (error) {
                console.error(error);
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, null)
        return textures;

    }

    public loadCubeTexture(gl: WebGLRenderingContext) {
        const texture = gl.createTexture();
        if (!texture) {
            throw new Error("Failed to create texture");
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        const faceInfos = [
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                url: '../Assets/Cubemap/pos-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                url: '../Assets/Cubemap/neg-x.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                url: '../Assets/Cubemap/pos-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                url: '../Assets/Cubemap/neg-y.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                url: '../Assets/Cubemap/pos-z.jpg',
            },
            {
                target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                url: '../Assets/Cubemap/neg-z.jpg',
            },
        ];
        faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;
            const image = new Image();
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            image.src = url;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                console.log("Loaded image", url);
            };
        });
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return texture;
    }

    private isPowerOf2(value: number) {
        return (value & (value - 1)) == 0;
    }
}