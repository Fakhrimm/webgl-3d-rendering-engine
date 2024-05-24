import { error } from 'console';
import { Variables } from '../UI/Variables';
import { AnimationClip, AnimationPath } from './animation';

export class AnimationRunner {
    isPlaying: boolean;
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
   
    get CurrentFrame() {
        return this.currentFrame;
    }
   
    get length() {
        return this.currentAnimation!.frames.length;
    }

    private get frame() {
        return this.currentAnimation!.frames[this.currentFrame];
    }

    update(deltaSecond: number) {
        if (this.isPlaying) {
            this.deltaFrame += deltaSecond * this.fps;
            if (this.deltaFrame >= 1) { // 1 frame
                this.currentFrame = (this.currentFrame + Math.floor(this.deltaFrame)) % this.length;
                this.deltaFrame %= 1;
                this.updateSceneGraph();
            }
        }
    }

    private updateSceneGraph() {
        const frame: AnimationPath | undefined = this.currentAnimation?.frames[this.currentFrame];

        let rootExists = false;

        if (this.currentAnimation?.name == this.variables.getTree().name) {
            if (frame?.keyframe) {
                if (frame.keyframe.translation) {
                    this.variables.getTree().reference.setPositionX(frame.keyframe.translation[0]);
                    this.variables.getTree().reference.setPositionY(frame.keyframe.translation[1]);
                    this.variables.getTree().reference.setPositionZ(frame.keyframe.translation[2]);
                }

                if (frame.keyframe.rotation) {
                    this.variables.getTree().reference.setRotationX(frame.keyframe.rotation[0] * Math.PI * 1.5);
                    this.variables.getTree().reference.setRotationY(frame.keyframe.rotation[1] * Math.PI * 1.5);
                    this.variables.getTree().reference.setRotationZ(frame.keyframe.rotation[2] * Math.PI * 1.5);
                }

                if (frame.keyframe.scale) {
                    this.variables.getTree().reference.setScaleX(frame.keyframe.scale[0]);
                    this.variables.getTree().reference.setScaleY(frame.keyframe.scale[1]);
                    this.variables.getTree().reference.setScaleZ(frame.keyframe.scale[2]);
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
                        if (child.keyframe.translation) {
                            children.reference.setPositionX(child.keyframe.translation[0]);
                            children.reference.setPositionY(child.keyframe.translation[1]);
                            children.reference.setPositionZ(child.keyframe.translation[2]);
                        }
            
                        if (child.keyframe.rotation) {
                            children.reference.setRotationX(child.keyframe.rotation[0] * Math.PI * 1.5);
                            children.reference.setRotationY(child.keyframe.rotation[1] * Math.PI * 1.5);
                            children.reference.setRotationZ(child.keyframe.rotation[2] * Math.PI * 1.5);
                        }
            
                        if (child.keyframe.scale) {
                            children.reference.setScaleX(child.keyframe.scale[0]);
                            children.reference.setScaleY(child.keyframe.scale[1]);
                            children.reference.setScaleZ(child.keyframe.scale[2]);
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
