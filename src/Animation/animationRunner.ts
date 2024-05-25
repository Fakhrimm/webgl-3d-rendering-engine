import { error } from 'console';
import { Variables } from '../UI/Variables';
import { AnimationClip, AnimationPath } from './animation';

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

    constructor(animFile: string, root: Object, variables: Variables, { fps = 30 } = {}) {
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
            console.log(this.currentFrame);
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
            this.currentFrame = this.length-1;
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
            if (this.deltaFrame >= 1) { // 1 frame
                if (this.isReverse) { 
                    let temp = (this.currentFrame - Math.floor(this.deltaFrame) + 2*this.length) % this.length;
                    if (this.currentFrame > temp && !this.isAuto) {
                        this.pause();
                    }

                    this.currentFrame = temp;
                } else {
                    let temp = (this.currentFrame + Math.floor(this.deltaFrame)) % this.length;
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
        const frame: AnimationPath | undefined = this.currentAnimation?.frames[0];

        let rootExists = false;

        if (this.currentAnimation?.name == this.variables.getTree().name) {
            if (frame?.keyframe) {
                for (let index in frame.keyframe) {
                    if (index == this.currentFrame.toString()) {
                        let element = frame.keyframe[index];
    
                        if (element.translation) {
                            this.variables.getTree().reference.setPositionX(element.translation[0]);
                            this.variables.getTree().reference.setPositionY(element.translation[1]);
                            this.variables.getTree().reference.setPositionZ(element.translation[2]);
                        }
        
                        if (element.rotation) {
                            this.variables.getTree().reference.setRotationX(element.rotation[0] * Math.PI * 1.5);
                            this.variables.getTree().reference.setRotationY(element.rotation[1] * Math.PI * 1.5);
                            this.variables.getTree().reference.setRotationZ(element.rotation[2] * Math.PI * 1.5);
                        }
        
                        if (element.scale) {
                            this.variables.getTree().reference.setScaleX(element.scale[0]);
                            this.variables.getTree().reference.setScaleY(element.scale[1]);
                            this.variables.getTree().reference.setScaleZ(element.scale[2]);
                        }
                    }
                }
            }

            if (frame?.children) {
                this.updateChildren(frame.children, this.variables.getTree());    
            }

            rootExists = true;
        }

        if (!rootExists) {
            throw new Error('Scene must be selected before playing');
        }
    }

    private updateChildren(animationChildren: { [childName: string]: AnimationPath; }, sceneChildren: any) {
        for (let animationChildrenName of Object.keys(animationChildren)) {
            let child = animationChildren[animationChildrenName];
            
            for (let children of sceneChildren.children) {
                if (children.name == animationChildrenName) {
                    if (child.keyframe) {
                        for (let index in child.keyframe) {
                            if (index == this.currentFrame.toString()) {
                                let element = child.keyframe[index];
                    
                                if (element.translation) {
                                    children.reference.setPositionX(element.translation[0]);
                                    children.reference.setPositionY(element.translation[1]);
                                    children.reference.setPositionZ(element.translation[2]);
                                }
                    
                                if (element.rotation) {
                                    children.reference.setRotationX(element.rotation[0] * Math.PI * 1.5);
                                    children.reference.setRotationY(element.rotation[1] * Math.PI * 1.5);
                                    children.reference.setRotationZ(element.rotation[2] * Math.PI * 1.5);
                                }
                    
                                if (element.scale) {
                                    children.reference.setScaleX(element.scale[0]);
                                    children.reference.setScaleY(element.scale[1]);
                                    children.reference.setScaleZ(element.scale[2]);
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
            console.error(`Failed to load animation file: ${response.statusText}`);
            return;
        }
    
        const animationClip: AnimationClip = await response.json();

        return animationClip;
    }
}
