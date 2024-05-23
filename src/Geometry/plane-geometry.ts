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
        const texcoord = PlaneGeometry.getTexcoord(widthSegments, heightSegments, direction);
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
                heightVertices.push(y);
                widthVertices.push(x + deltaWidth);
                heightVertices.push(y);
                widthVertices.push(x + deltaWidth);
                heightVertices.push(y + deltaHeight);

                // Second Triangle
                widthVertices.push(x + deltaWidth);
                heightVertices.push(y + deltaHeight);
                widthVertices.push(x);
                heightVertices.push(y + deltaHeight);
                widthVertices.push(x);
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

    static getTexcoord(widthSegments: number, heightSegments: number, direction: string): number[] {
        const texcoord: number[] = [];
        const deltaWidth = -1 / widthSegments;
        const deltaHeight = -1 / heightSegments;
        for (let i = 0; i < widthSegments; i++) {
            for (let j = 0; j < heightSegments; j++) {
                const x = 1 - i * deltaWidth;
                const y = 1 - j * deltaHeight;

                // First Triangle
                texcoord.push(x);
                texcoord.push(y);
                texcoord.push(x + deltaWidth);
                texcoord.push(y);
                texcoord.push(x + deltaWidth);
                texcoord.push(y + deltaHeight);

                // Second Triangle
                texcoord.push(x + deltaWidth);
                texcoord.push(y + deltaHeight);
                texcoord.push(x);
                texcoord.push(y + deltaHeight);
                texcoord.push(x);
                texcoord.push(y);
            }
        }

        // if (direction === 'z-') {
        //     console.log('reverse');
        //     texcoord.reverse();
        // }

        return texcoord;
    }
}
