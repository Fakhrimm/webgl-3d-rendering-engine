import { BufferAttribute } from './bufferAttribute'

export class BufferGeometry {
    private _attributes: {[name: string]: BufferAttribute};
    private _indices?: BufferAttribute;

    constructor() {
        this._attributes = {};
    }

    get attributes() {
        return this._attributes;
    }


    get indices() {
        return this._indices;
    }


    setIndices(indices: BufferAttribute) {
        this._indices = indices;
        return this;
    }


    removeIndices() {
        this._indices = undefined;
        return this;
    }


    setAttribute(name: string, attribute: BufferAttribute) {
        this._attributes[name] = attribute;
        return this;
    }


    getAttribute(name: string) {
        return this._attributes[name];
    }


    deleteAttribute(name: string) {
        delete this._attributes[name];
        return this;
    }

    calculateNormals(forceNewAttribute=false) {
        const position = this.getAttribute('position');
        if (!position) return;
        let normal = this.getAttribute('normal');
        if (forceNewAttribute || !normal)
            normal = new BufferAttribute(new Float32Array(position.length), position.size);
        // Lakukan kalkulasi normal disini.
        this.setAttribute('normal', normal);
    }

    static fromJSON(json: any): BufferGeometry {
        const geometry = new BufferGeometry();
        if (json.indices) {
            geometry._indices = BufferAttribute.fromJSON(json.indices);
        }
        for (const name in json.attributes) {
            geometry._attributes[name] = BufferAttribute.fromJSON(json.attributes[name]);
        }
        return geometry;
    }

    public toJSON(): object {
        const attributes: {[name: string]: object} = {};
        for (const name in this._attributes) {
            attributes[name] = BufferAttribute.toJSON(this._attributes[name]);
        }
        return {
            attributes: attributes,
            indices: this._indices ? BufferAttribute.toJSON(this._indices) : undefined,
        };
    }
}
