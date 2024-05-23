import { BufferGeometry } from './bufferGeometry';

export class PlaneGeometry extends BufferGeometry {

    constructor(
        width = 1,
        height = 1,
        depth = 1,
        widthSegments = 1,
        heightSegments = 1,
        direction: string = 'z+'
    ) {
        super();
        const vertices = PlaneGeometry.getVertices(width, height, depth, widthSegments, heightSegments, direction);
        const texcoord = PlaneGeometry.getTexcoord(widthSegments, heightSegments);
        this.setAllInputs(new Float32Array(vertices), new Uint16Array(), new Float32Array(texcoord));
    }

    static getVertices(width: number, height: number, depth: number, widthSegments: number, heightSegments: number, direction: string): number[] {
        const vertices : number[] = [];
        const heightVertices: number[] = [];
        const widthVertices: number[] = [];
        const hw = -width / 2;
        const hh = -height / 2;
        const hd = depth / 2;
        const deltaWidth = width / widthSegments;
        const deltaHeight = height / heightSegments;

        for (let i = 0; i < widthSegments; i++) {
            for (let j = 0; j < heightSegments; j++) {
                const x = hw + i * deltaWidth;
                const y = hh + j * deltaHeight;

                // First Triangle
                widthVertices.push(x);
                widthVertices.push(x + deltaWidth);
                widthVertices.push(x + deltaWidth);
                heightVertices.push(y);
                heightVertices.push(y);
                heightVertices.push(y + deltaHeight);

                // Second Triangle
                widthVertices.push(x + deltaWidth);
                widthVertices.push(x);
                widthVertices.push(x);
                heightVertices.push(y + deltaHeight);
                heightVertices.push(y + deltaHeight);
                heightVertices.push(y);
            }
        }

        switch (direction) {
            case 'z+':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(widthVertices[i]);
                    vertices.push(heightVertices[i]);
                    vertices.push(+hd);
                    vertices.push(1);
                }
                break;
            case 'z-':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(heightVertices[i]);
                    vertices.push(widthVertices[i]);
                    vertices.push(-hd);
                    vertices.push(1);
                }
                break;
            case 'x+':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(hd);
                    vertices.push(widthVertices[i]);
                    vertices.push(heightVertices[i]);
                    vertices.push(1);
                }
                break;
            case 'x-':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(-hd);
                    vertices.push(heightVertices[i]);
                    vertices.push(widthVertices[i]);
                    vertices.push(1);
                }
                break;
            case 'y+':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(heightVertices[i]);
                    vertices.push(hd);
                    vertices.push(widthVertices[i]);
                    vertices.push(1);
                }
                break;
            case 'y-':
                for (let i = 0; i < widthVertices.length; i++) {
                    vertices.push(widthVertices[i]);
                    vertices.push(-hd);
                    vertices.push(heightVertices[i]);
                    vertices.push(1);
                }
                break;
        }
        return vertices;
    }

    static getTexcoord(widthSegments: number, heightSegments: number): number[] {
        const xTexcoord: number[] = [];
        const yTexcoord: number[] = [];
        const texcoord: number[] = [];
        const deltaWidth = 1 / widthSegments;
        const deltaHeight = 1 / heightSegments;

        for (let i = 0; i < widthSegments; i++) {
            for (let j = 0; j < heightSegments; j++) {
                const x = i * deltaWidth;
                const y = j * deltaHeight;

                // First Triangle
                xTexcoord.push(x);
                xTexcoord.push(x + deltaWidth);
                xTexcoord.push(x + deltaWidth);
                yTexcoord.push(y);
                yTexcoord.push(y);
                yTexcoord.push(y + deltaHeight);

                // Second Triangle
                xTexcoord.push(x + deltaWidth);
                xTexcoord.push(x);
                xTexcoord.push(x);
                yTexcoord.push(y + deltaHeight);
                yTexcoord.push(y + deltaHeight);
                yTexcoord.push(y);
            }
        }

        for (let i = 0; i < xTexcoord.length; i++) {
            texcoord.push(yTexcoord[i]);
            texcoord.push(xTexcoord[i]);
        }

        return texcoord;
    }
}
