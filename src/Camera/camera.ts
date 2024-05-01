export class Camera extends Node {
    constructor() {
        super()
    }
    
    static fromJSON(json: any): Camera {
        return new Camera()
    }
    toJSON() {
        console.log('Camera toJSON')
    }
}