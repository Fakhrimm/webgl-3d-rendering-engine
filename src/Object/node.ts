import { Matrix4 } from "../Math/matrix-4";
import { Vector3 } from "../Math/vector-3";
import { Euler } from "../Math/euler.ts";
import { Quaternion } from "../Math/quaternion.ts";

export class Node {
    public name: string = "";
    protected parent: Node | null = null;
    private children: Node[] = [];

    private position: Vector3 = new Vector3(0, 0, 0);
    private scale: Vector3 = new Vector3(1, 1, 1);
    private rotation: Euler = new Euler(0, 0, 0);
    private quaternion: Quaternion = new Quaternion().identity();

    private localMatrix: Matrix4 = new Matrix4();
    protected worldMatrix: Matrix4 = new Matrix4();

    constructor() {
        const onRotationChange = () => {
            this.quaternion.setFromEuler(this.rotation, false);
        };

        const onQuaternionChange = () => {
            this.rotation.setFromQuaternion(this.quaternion, false);
        };

        this.rotation._onChange(onRotationChange);
        this.quaternion._onChange(onQuaternionChange);
    }

    public setParent(parent: Node) {
        if (this.parent) {
            this.parent.children = this.parent.children.filter(
                (child) => child !== this
            );
        }

        this.parent = parent;
        parent.addChild(this);
    }

    // Dont make this public, we only use setParent
    private addChild(child: Node) {
        this.children.push(child);
        child.parent = this;
    }

    public updateLocalMatrix() {
        this.localMatrix.compose(this.position, this.quaternion, this.scale);
    }

    public updateWorldMatrix() {
        this.updateLocalMatrix();
        if (this.parent) {
            this.worldMatrix = this.parent.worldMatrix.clone().multiply(this.localMatrix);
        } else {
            this.worldMatrix = this.localMatrix.clone();
        }
    }

    public getWorldMatrix() {
        return this.worldMatrix;
    }

    public localToWorld(localPosition: Vector3): Vector3 {
        return localPosition.clone().applyMatrix4(this.worldMatrix);
    }

    public setPosition(position: Vector3) {
        this.position = position;
    }

    public setPositionX(x: number) {
        this.position.setX(x);
    }

    public setPositionY(y: number) {
        this.position.setY(y);
    }

    public setPositionZ(z: number) {
        this.position.setZ(z);
    }

    public getPosition() {
        return this.position;
    }

    public setScale(scale: Vector3) {
        this.scale = scale;
    }

    public setScaleX(x: number) {
        this.scale.setX(x);
    }

    public setScaleY(y: number) {
        this.scale.setY(y);
    }

    public setScaleZ(z: number) {
        this.scale.setZ(z);
    }

    public getScale() {
        return this.scale;
    }

    public getRotation() {
        return this.quaternion;
    }

    public setRotationFromEuler(euler: Euler) {
        this.quaternion.setFromEuler( euler, true );
    }

    public setRotationX(x: number) {
        this.rotation.x =  x;
    }

    public setRotationY(y: number) {
        this.rotation.y =  y;
    }

    public setRotationZ(z: number) {
        this.rotation.z =  z;
    }

    setRotationFromAxisAngle(axis: Vector3, angle: number) {
        // assumes axis is normalized
        this.quaternion.setFromAxisAngle(axis, angle);
    }

    public worldToLocal(worldPosition: Vector3) {
        return worldPosition
            .clone()
            .applyMatrix4(this.worldMatrix.clone().invert());
    }

    public traverse(callback: (node: Node) => void) {
        callback(this);
        this.children.forEach((child) => child.traverse(callback));
    }

    public traverseWithTotalBreak(callback: (node: Node) => boolean) {
        let continueTraversal = callback(this);
        if (!continueTraversal) return false;

        for (let child of this.children) {
            continueTraversal = child.traverseWithTotalBreak(callback);
            if (!continueTraversal) return false;
        }

        return true;
    }

    public getParent(): Node | null {
        return this.parent;
    }

    public getChildren(): Node[] {
        return [...this.children];
    }
}
