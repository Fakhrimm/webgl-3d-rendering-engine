import { Matrix4 } from "../Math/matrix-4"
import { Vector3 } from "../Math/vector-3"

export class Node {
    public name: string = ''
    protected parent: Node | null = null
    private children: Node[] = []

    private position: Vector3 = new Vector3(0, 0, 0)
    private scale: Vector3 = new Vector3(1, 1, 1)


    private localMatrix: Matrix4 = new Matrix4()
    protected worldMatrix: Matrix4 = new Matrix4()

    constructor() {}

    public setParent(parent: Node) {
        if (this.parent) {
        this.parent.children = this.parent.children.filter(child => child !== this)
        }

        this.parent = parent
        parent.addChild(this)
    }

    // Dont make this public, we only use setParent
    private addChild(child: Node) {
        this.children.push(child)
        child.parent = this
    }

    public updateWorldMatrix(parentWorldMatrix: Matrix4) {
        this.worldMatrix.copy(parentWorldMatrix).multiply(this.localMatrix)
        this.children.forEach(child => child.updateWorldMatrix(this.worldMatrix))
    }
  
    public localToWorld(localPosition: Vector3) {
        return localPosition.clone().applyMatrix4(this.worldMatrix)
    }

    public setPosition(position: Vector3) {
        this.position = position
    }

    public getPosition() {
        return this.position
    }

    public setScale(scale: Vector3) {
        this.scale = scale
    }

    public getScale() {
        return this.scale
    }

    public worldToLocal(worldPosition: Vector3) {
        return worldPosition.clone().applyMatrix4(this.worldMatrix.clone().invert())
    }
}