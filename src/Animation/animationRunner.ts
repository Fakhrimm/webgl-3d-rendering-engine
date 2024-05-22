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

        const length = this.variables.getTree().children.length;

        let rootExists = false;

        for (let i = 0; i < length; i++) {
            const child = this.variables.getTree().children[i];

            if (frame?.keyframe && child.name == this.currentAnimation?.name) {
                if (frame.keyframe.translation) {
                    this.variables.getTree().children[i].reference.setPositionX(frame.keyframe.translation[0]);
                    this.variables.getTree().children[i].reference.setPositionY(frame.keyframe.translation[1]);
                    this.variables.getTree().children[i].reference.setPositionZ(frame.keyframe.translation[2]);
                }
    
                if (frame.keyframe.rotation) {
                    this.variables.getTree().children[i].reference.setRotationX(frame.keyframe.rotation[0] * Math.PI * 1.5);
                    this.variables.getTree().children[i].reference.setRotationY(frame.keyframe.rotation[1] * Math.PI * 1.5);
                    this.variables.getTree().children[i].reference.setRotationZ(frame.keyframe.rotation[2] * Math.PI * 1.5);
                }
    
                if (frame.keyframe.scale) {
                    this.variables.getTree().children[i].reference.setScaleX(frame.keyframe.scale[0]);
                    this.variables.getTree().children[i].reference.setScaleY(frame.keyframe.scale[1]);
                    this.variables.getTree().children[i].reference.setScaleZ(frame.keyframe.scale[2]);
                }

                rootExists = true;
            }
        }

        if (!rootExists) {
            throw new Error('Scene must be selected before playing');
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
