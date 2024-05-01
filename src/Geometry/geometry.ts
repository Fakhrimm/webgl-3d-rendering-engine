export class Geometry {
    static fromJSON(json: any): Geometry {
        return new Geometry()
    }

    toJSON() {
        console.log('Material toJSON')
    }

}