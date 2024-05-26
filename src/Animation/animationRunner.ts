import { Variables } from "../UI/Variables";
import { AnimationClip, AnimationPath } from "./animation";

// EASING FUNCTIONS
function normal(t: any) {
    return t;
}

function easeInOutSine(t: any) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutQuad(t: any) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeInOutCubic(t: any) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuart(t: any) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function easeInOutQuint(t: any) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function easeInOutExpo(t: any) {
    return t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

function easeInOutCirc(t: any) {
    return t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
}

function easeInOutBack(t: any) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}

function easeInOutElastic(t: any) {
    const c5 = (2 * Math.PI) / 4.5;
    
    return t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
}

function easeOutBounce(t: any) {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}

function easeInOutBounce(t: any) {
    return t < 0.5
      ? (1 - easeOutBounce(1 - 2 * t)) / 2
      : (1 + easeOutBounce(2 * t - 1)) / 2;
}

const easingFunctions = {
    "easeInOutSine": easeInOutSine,
    "easeInOutQuad": easeInOutQuad,
    "easeInOutCubic": easeInOutCubic,
    "easeInOutQuart": easeInOutQuart,
    "easeInOutQuint": easeInOutQuint,
    "easeInOutExpo": easeInOutExpo,
    "easeInOutCirc": easeInOutCirc,
    "easeInOutBack": easeInOutBack,
    "easeInOutElastic": easeInOutElastic,
    "easeInOutBounce": easeInOutBounce,
    "normal": normal
};

function tween(startValue: any, endValue: any, duration: any, easingFuncName: string, currentTime: any) {
    const easingFunc = easingFunctions[easingFuncName as keyof typeof easingFunctions];
    if (!easingFunc) {
        throw new Error(`Unknown easing function: ${easingFuncName}`);
    }

    const t = Math.min(currentTime/duration, 1); // Normalized time
    const easedT = easingFunc(t);
    return startValue + (endValue - startValue) * easedT;
}

export class AnimationRunner {
    private isPlaying: boolean;
    private isReverse: boolean;
    private isAuto: boolean;
    private fps: number = 35;
    private currentFrame: number = 0;
    private deltaFrame: number = 0;
    private currentAnimation?: AnimationClip;
    private variables: Variables;
    private easingType: string = "normal";

    constructor(
        animFile: string,
        variables: Variables
    ) {
        this.load(animFile).then((animationClip) => {
            this.currentAnimation = animationClip;
        });
        this.isPlaying = false;
        this.isReverse = false;
        this.isAuto = true;
        this.variables = variables;
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
            this.currentFrame = (this.currentFrame + 1) % this.length;
            
            this.updateSceneGraph();
        }
    }

    public prevFrame() {
        if (!this.isPlaying) {
            if (this.currentFrame == 0) {
                this.currentFrame = this.length - 1;
            } else {
                this.currentFrame--;
            }
            
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

    public setEasingType(easingType: string) {
        this.easingType = easingType;
    }

    public setFPS(fps: number) {
        console.log("fps", fps);
        this.fps = fps;
    }

    update(deltaSecond: number) {
        if (this.isPlaying) {
            this.deltaFrame += deltaSecond * this.fps;
            if (this.deltaFrame >= 1) {
                if (this.isReverse) {
                    this.currentFrame = this.currentFrame - Math.floor(this.deltaFrame);
                    this.currentFrame = this.currentFrame < 0 ? this.length + this.currentFrame : this.currentFrame;
                } else {
                    this.currentFrame = (this.currentFrame + Math.floor(this.deltaFrame)) % this.length;
                }
                
                this.deltaFrame %= 1;
                this.updateSceneGraph();
            }

            if (this.currentFrame == this.length-1 && !this.isAuto) {
                this.isPlaying = false;
            }
        }
    }

    private updateSceneGraph() {
        const frame: AnimationPath | undefined =
            this.currentAnimation?.frames[0];

        let rootExists = false;
        if (
            this.currentAnimation?.name == this.variables.getOriginScene().name
        ) {
            if (frame?.keyframe) {
                for (let index in frame.keyframe) {
                    if (index == this.currentFrame.toString()) {
                        let element = frame.keyframe[index];
                        if (element.translation) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionX(tween(this.variables.getOriginScene().getOriginNode().getPosition().x, element.translation[0], this.deltaFrame, this.easingType, this.deltaFrame));
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionY(tween(this.variables.getOriginScene().getOriginNode().getPosition().y, element.translation[1], this.deltaFrame, this.easingType, this.deltaFrame));
                                this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setPositionZ(tween(this.variables.getOriginScene().getOriginNode().getPosition().z, element.translation[2], this.deltaFrame, this.easingType, this.deltaFrame));
                        }

                        if (element.rotation) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationX(
                                    tween(this.variables.getOriginScene().getOriginNode().getRotation().x, element.rotation[0] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                );
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationY(
                                    tween(this.variables.getOriginScene().getOriginNode().getRotation().y, element.rotation[1] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                );
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setRotationZ(
                                    tween(this.variables.getOriginScene().getOriginNode().getRotation().z, element.rotation[2] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                );
                        }

                        if (element.scale) {
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleX(tween(this.variables.getOriginScene().getOriginNode().getScale().x, element.scale[0] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame));
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleY(tween(this.variables.getOriginScene().getOriginNode().getScale().y, element.scale[1] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame));
                            this.variables
                                .getOriginScene()
                                .getOriginNode()
                                .setScaleZ(tween(this.variables.getOriginScene().getOriginNode().getScale().z, element.scale[2] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame));
                        }
                    }
                }
            }

            if (frame?.children) {
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
                                        tween(children.getPosition().x, element.translation[0], this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setPositionY(
                                        tween(children.getPosition().y, element.translation[1], this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setPositionZ(
                                        tween(children.getPosition().z, element.translation[2], this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                }

                                if (element.rotation) {
                                    children.setRotationX(
                                        tween(children.getRotation().x, element.rotation[0] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setRotationY(
                                        tween(children.getRotation().y, element.rotation[1] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setRotationZ(
                                        tween(children.getRotation().z, element.rotation[2] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                }

                                if (element.scale) {
                                    children.setScaleX(
                                        tween(children.getScale().x, element.scale[0] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setScaleY(
                                        tween(children.getScale().y, element.scale[1] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
                                    children.setScaleZ(
                                        tween(children.getScale().z, element.scale[2] * Math.PI * 1.5, this.deltaFrame, this.easingType, this.deltaFrame)
                                    );
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
