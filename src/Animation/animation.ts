export type AnimationTRS = {
    translation?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
}


export type AnimationPath = {
    keyframe?: AnimationTRS;
    children?: {
        [childName: string]: AnimationPath;
    }
}


export type AnimationClip = {
    name: string,
    frames: AnimationPath[];
}

/* EXAMPLE
name: "Fox Walking",
frames: [
    // 0
    {
        keyframe: {
            translation: [-0.5, 0, 0],
            rotation: [0, 0, 0],
        },
        children: {
            RHead: {
                keyframe: {
                    translation: [0.75, 1.5, 0],
                    rotation: [0, 0, 0],
                },
            },
            RTail: {
                keyframe: {
                    translation: [-0.75, 1.5, 0],
                    rotation: [0, 30, 0],
                },
                children: {
                    RTailTip: {
                        keyframes: {
                            translation: [-0.5, 0, 0],
                            rotation: [0, 0, 0],
                        },
                    }
                }
            }
        },
    },
    // 1
    {
        keyframe: {
            translation: [-0.5, 0, 0],
            rotation: [0, 0.5, 0],
        },
        children: {
            RHead: {
                keyframes: {
                    translation: [0.75, 1.5, 0],
                    rotation: [0, 0, 0],
                },
            },
        },
    },
],
};
*/
