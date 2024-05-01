export class Material {
    static fromJSON(json: any): Material {
        return new Material()
    }

    toJSON() {
        console.log('Material toJSON')
    }
}