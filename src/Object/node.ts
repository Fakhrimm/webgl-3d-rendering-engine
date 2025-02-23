import { Matrix4 } from "../Math/matrix-4";
import { Vector3 } from "../Math/vector-3";
import { Euler } from "../Math/euler.ts";
import { Quaternion } from "../Math/quaternion.ts";
import { INode } from "../Utils/model-interface.ts";
import {NodeTypes} from "../Types/node-types.ts";
import {Camera} from "../Camera/camera.ts";

export class Node {
    public name: string = "";
    protected nodeType: NodeTypes;
    protected parent: Node | null = null;
    private children: Node[] = [];

    private position: Vector3 = new Vector3(0, 0, 0);
    private scale: Vector3 = new Vector3(1, 1, 1);
    private rotation: Euler = new Euler(0, 0, 0);
    private quaternion: Quaternion = new Quaternion().identity();

    protected localMatrix: Matrix4 = new Matrix4();
    protected worldMatrix: Matrix4 = new Matrix4();

    constructor() {
        this.nodeType = NodeTypes.NODE;
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

    protected setLocalMatrix(matrix: Matrix4) {
        this.localMatrix = matrix;
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
    public getWorldInverseTransposeMatrix() {
        return this.worldMatrix.clone().invert().transpose();
    }

    public localToWorld(localPosition: Vector3): Vector3 {
        return localPosition.clone().applyMatrix4(this.worldMatrix);
    }

    public setPosition(x: number, y: number, z: number) {
        this.position = new Vector3(x, y, z);
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

    public setScale(x: number, y: number, z: number) {
        this.scale = new Vector3(x, y, z);
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
        return this.rotation;
    }

    public setRotationFromEuler(euler: Euler) {
        this.quaternion.setFromEuler( euler, true );
    }

    public setRotationDegrees(x: number, y: number, z: number) {
        x = x * Math.PI / 180;
        y = y * Math.PI / 180;
        z = z * Math.PI / 180;

        this.setRotationFromEuler(new Euler(x, y, z))
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

    public searchCamera(cameraType: new (...args: any[]) => Camera): Camera | null {
        let foundCamera: Camera | null = null;
        this.traverseWithTotalBreak((node) => {
            if (node instanceof cameraType) {
                foundCamera = node as Camera;
                return false; // Found the camera, stop traversal
            }
            return true; // Continue traversal otherwise
        });
        if (!foundCamera) {
            console.warn("No camera of type", cameraType, "found in the node");
        }
        return foundCamera;
    }

    public getParent(): Node | null {
        return this.parent;
    }

    public getChildren(): Node[] {
        return [...this.children];
    }

    public toRaw(): INode {
        return {
            name: this.name,
            nodeType: this.nodeType,
            position: {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
            },
            scale: {
                x: this.scale.x,
                y: this.scale.y,
                z: this.scale.z,
            },
            rotation: {
                x: this.rotation.x,
                y: this.rotation.y,
                z: this.rotation.z,
            },
            children: [],
        };
    }

    public static fromRaw(raw: INode): Node {
        const node = new Node();
        node.name = raw.name;
        node.setPosition(raw.position.x, raw.position.y, raw.position.z);
        node.setScale(raw.scale.x, raw.scale.y, raw.scale.z);
        node.setRotationFromEuler(new Euler(raw.rotation.x, raw.rotation.y, raw.rotation.z));
        return node;
    }
}
