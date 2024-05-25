import { error } from "console";
import { Variables } from "../UI/Variables";
import { AnimationClip, AnimationPath } from "./animation";

export class AnimationRunner {
    isPlaying: boolean;
    isReverse: boolean;
    isAuto: boolean;
    fps: number = 30;
    private root: Object;
    private currentFrame: number = 0;
    private deltaFrame: number = 0;
    private currentAnimation?: AnimationClip;
    private variables: Variables;

    constructor(
        animFile: string,
        root: Object,
        variables: Variables,
        { fps = 30 } = {}
    ) {
        this.load(animFile).then((animationClip) => {
            this.currentAnimation = animationClip;
        });
        this.isPlaying = false;
        this.isReverse = false;
        this.isAuto = true;
        this.variables = variables;
        this.fps = fps;
        this.root = root;
    }

    public play() {
        this.isPlaying = true;
    }

    public pause() {
        this.isPlaying = false;
    }

    public reverse() {
        this.isReverse = !this.isReverse;
    }

    public auto() {
        this.isAuto = !this.isAuto;
    }

    public nextFrame() {
        if (!this.isPlaying) {
            if (this.isReverse) {
                if (this.currentFrame == 0) {
                    this.currentFrame = this.length - 1;
                } else {
                    this.currentFrame--;
                }
            } else {
                this.currentFrame = (this.currentFrame + 1) % this.length;
            }
            this.updateSceneGraph();
        }
    }

    public prevFrame() {
        if (!this.isPlaying) {
            if (this.isReverse) {
                this.currentFrame = (this.currentFrame + 1) % this.length;
            } else {
                if (this.currentFrame == 0) {
                    this.currentFrame = this.length - 1;
                } else {
                    this.currentFrame--;
                }
            }
            // console.log(this.currentFrame);
            this.updateSceneGraph();
        }
    }

    public first() {
        if (!this.isPlaying) {
            this.currentFrame = 0;
            this.updateSceneGraph();
        }
    }

    public last() {
        if (!this.isPlaying) {
            this.currentFrame = this.length - 1;
            this.updateSceneGraph();
        }
    }

    get CurrentFrame() {
        return this.currentFrame;
    }

    get length() {
        return this.currentAnimation!.totalFrames;
    }

    private get frame() {
        return this.currentAnimation!.frames[this.currentFrame];
    }

    update(deltaSecond: number) {
        if (this.isPlaying) {
            this.deltaFrame += deltaSecond * this.fps;
            if (this.deltaFrame >= 1) {
                // 1 frame
                if (this.isReverse) {
                    let temp =
                        (this.currentFrame -
                            Math.floor(this.deltaFrame) +
                            2 * this.length) %
                        this.length;
                    if (this.currentFrame > temp && !this.isAuto) {
                        this.pause();
                    }

                    this.currentFrame = temp;
                } else {
                    let temp =
                        (this.currentFrame + Math.floor(this.deltaFrame)) %
                        this.length;
                    if (this.currentFrame < temp && !this.isAuto) {
                        this.pause();
                    }

                    this.currentFrame = temp;
                }
                this.deltaFrame %= 1;
                this.updateSceneGraph();
            }
        }
    }

    private updateSceneGraph() {
        const frame: AnimationPath | undefined =
            this.currentAnimation?.frames[0];

        let rootExists = false;

        // console.log("MASUK 1");
        if (
            this.currentAnimation?.name == this.variables.getOriginScene().name
        ) {
            // console.log(this.currentAnimation.name);
            // console.log(this.variables.getOriginScene().name);
            // console.log(this.variables.getTree().name);
            // console.log("MASUK 2");
            if (frame?.keyframe) {
                // console.log("MASUK 3");
                for (let index in frame.keyframe) {
                    // console.log("MASUK 4");
                    if (index == this.currentFrame.toString()) {
                        // console.log("MASUK 5");
                        let element = frame.keyframe[index];
                        // console.log("MASUK 6");

                        if (element.translation) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionX(element.translation[0]);
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionY(element.translation[1]);
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionZ(element.translation[2]);
                        }

                        if (element.rotation) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationX(
                                    element.rotation[0] * Math.PI * 1.5
                                );
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationY(
                                    element.rotation[1] * Math.PI * 1.5
                                );
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationZ(
                                    element.rotation[2] * Math.PI * 1.5
                                );
                        }

                        if (element.scale) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleX(element.scale[0]);
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleY(element.scale[1]);
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleZ(element.scale[2]);
                        }
                    }
                }
            }

            if (frame?.children) {
                // console.log("tes", this.variables.getOriginScene());
                this.updateChildren(
                    frame.children,
                    this.variables.getOriginScene()
                );
            }

            rootExists = true;
        }

        if (!rootExists) {
            throw new Error("Scene must be selected before playing animation");
        }
    }

    private updateChildren(
        animationChildren: { [childName: string]: AnimationPath },
        sceneChildren: any
    ) {
        // console.log("tes2", animationChildren);
        for (let animationChildrenName of Object.keys(animationChildren)) {
            let child = animationChildren[animationChildrenName];

            for (let children of sceneChildren.children) {
                if (children.name == animationChildrenName) {
                    if (child.keyframe) {
                        for (let index in child.keyframe) {
                            if (index == this.currentFrame.toString()) {
                                let element = child.keyframe[index];

                                if (element.translation) {
                                    children.setPositionX(
                                        element.translation[0]
                                    );
                                    children.setPositionY(
                                        element.translation[1]
                                    );
                                    children.setPositionZ(
                                        element.translation[2]
                                    );
                                }

                                if (element.rotation) {
                                    // console.log("tes3", children);
                                    children.setRotationX(
                                        element.rotation[0] * Math.PI * 1.5
                                    );
                                    children.setRotationY(
                                        element.rotation[1] * Math.PI * 1.5
                                    );
                                    children.setRotationZ(
                                        element.rotation[2] * Math.PI * 1.5
                                    );
                                }

                                if (element.scale) {
                                    children.setScaleX(element.scale[0]);
                                    children.setScaleY(element.scale[1]);
                                    children.setScaleZ(element.scale[2]);
                                }
                            }
                        }
                    }

                    if (child.children) {
                        this.updateChildren(child.children, children);
                    }
                }
            }
        }
    }

    private async load(animFile: string): Promise<AnimationClip | undefined> {
        const response = await fetch(animFile);
        if (!response.ok) {
            console.error(
                `Failed to load animation file: ${response.statusText}`
            );
            return;
        }

        const animationClip: AnimationClip = await response.json();

        return animationClip;
    }
}
