import {Scene} from "./scene.ts";
import {PerspectiveCamera} from "../Camera/perspective-camera.ts";
import {OrthographicCamera} from "../Camera/orthographic-camera.ts";
import {ObliqueCamera} from "../Camera/oblique-camera.ts";
import {BasicMaterial} from "../Material/basic-material.ts";
import {PhongMaterial} from "../Material/phong-material.ts";
import {ParallaxMaterial} from "../Material/parallax-material.ts";
import {ReflectionMaterial} from "../Material/reflection-material.ts";
import {BoxGeometry} from "../Geometry/boxGeometry.ts";
import {Mesh} from "./mesh.ts";
import {Node} from "./node.ts";
import {Color} from "../Math/color.ts";
import {TextureTypes} from "../Types/texture-types.ts";

export function getFakhriScene(canvas: HTMLCanvasElement): Scene {
    const scene = new Scene();
    scene.name = "scene"
    const origin = new Node()
    origin.name = "origin"
    const perspectiveCamera = new PerspectiveCamera(
        60,
        canvas.width / canvas.height,
        0.1,
        20000,
        1)
    perspectiveCamera.name = "PerspectiveCamera"
    perspectiveCamera.setPosition(0, 0, 500)

    const orthographicCamera = new OrthographicCamera(
        -canvas.width / 2,
        canvas.width / 2,
        canvas.height / 2,
        -canvas.height / 2,
        -1000,
        +1000
    )
    orthographicCamera.name = "OrthoCamera"

    const obliqueCamera = new ObliqueCamera(
        -canvas.width / 2,
        canvas.width / 2,
        canvas.height / 2,
        -canvas.height / 2,
        1000,
        -1000
    )
    obliqueCamera.name = "ObliqueCamera"

    const m1 = new BasicMaterial(
        Color.BLUE,
        TextureTypes.DIFFUSE_0
    )
    const m2 = new PhongMaterial(
        Color.WHITE,
        Color.WHITE,
        50,
        0.2,
        0.8,
        0.5,
        TextureTypes.DIFFUSE_1,
        TextureTypes.SPECULAR_1,
        TextureTypes.NORMAL_0,
        TextureTypes.DISPLACEMENT_0,
        100,
        0.0
    )
    const m3 = new ParallaxMaterial(
        Color.WHITE,
        Color.WHITE,
        50,
        0.2,
        0.8,
        0.5,
        TextureTypes.DIFFUSE_BRICKS,
        TextureTypes.SPECULAR_0,
        TextureTypes.NORMAL_BRICKS,
        TextureTypes.HEIGHT_BRICKS,
        0.05,
    )
    const m4 = new ReflectionMaterial()
    const m5 = new BasicMaterial(
        Color.BLACK,
        TextureTypes.DIFFUSE_0
    )
    const m6 = new PhongMaterial(
        Color.WHITE,
        Color.WHITE,
        50,
        0.2,
        0.8,
        0.5,
        TextureTypes.DIFFUSE_3,
        TextureTypes.SPECULAR_3,
        TextureTypes.NORMAL_3,
        TextureTypes.DISPLACEMENT_0,
        100,
        0.0
    )

    const palm = new Mesh(new BoxGeometry(250, 160, 50), m3)
    palm.name = "palm"
    palm.setPosition(0, -100, 0)

    const thumb = new Mesh(new BoxGeometry(50, 100, 50), m4)
    thumb.name = "thumb"
    thumb.setPosition(170, 50, 0)
    thumb.setParent(palm)

    const indexBase = new Mesh(new BoxGeometry(20, 20, 20), m5)
    indexBase.name = "indexBase"
    indexBase.setPosition(90, 90, 0)
    indexBase.setParent(palm)

    const index = new Mesh(new BoxGeometry(50, 90, 50), m4)
    index.name = "index"
    index.setPosition(0, 45, 0)
    index.setParent(indexBase)

    const indexJoint = new Mesh(new BoxGeometry(20, 20, 20), m5);
    indexJoint.name = "indexJoint"
    indexJoint.setPosition(0, 55, 0)
    indexJoint.setParent(index)

    const indexTip = new Mesh(new BoxGeometry(40, 70, 40 ), m4);
    indexTip.name = "indexTip"
    indexTip.setPosition(0, 40, 0)
    indexTip.setParent(indexJoint)

    const middleBase = new Mesh(new BoxGeometry(20, 20, 20), m5)
    middleBase.name = "middleBase"
    middleBase.setPosition(30, 90, 0)
    middleBase.setParent(palm)

    const middle = new Mesh(new BoxGeometry(50, 100, 50), m4)
    middle.name = "middle"
    middle.setPosition(0, 50, 0)
    middle.setParent(middleBase)

    const middleJoint = new Mesh(new BoxGeometry(20, 20, 20), m5)
    middleJoint.name = "middleJoint"
    middleJoint.setPosition(0, 60, 0)
    middleJoint.setParent(middle)

    const middleTip = new Mesh(new BoxGeometry(40, 90, 40), m4)
    middleTip.name = "middleTip"
    middleTip.setPosition(0, 50, 0)
    middleTip.setParent(middleJoint)

    const ringBase = new Mesh(new BoxGeometry(20, 20, 20), m5)
    ringBase.name = "ringBase"
    ringBase.setPosition(-30, 90, 0)
    ringBase.setParent(palm)

    const ring = new Mesh(new BoxGeometry(50, 100, 50), m2)
    ring.name = "ring"
    ring.setPosition(0, 50, 0)
    ring.setParent(ringBase)

    const ringJoint = new Mesh(new BoxGeometry(20, 20, 20), m5)
    ringJoint.name = "ringJoint"
    ringJoint.setPosition(0, 60, 0)
    ringJoint.setParent(ring)

    const ringTip = new Mesh(new BoxGeometry(40, 90, 40), m2)
    ringTip.name = "ringTip"
    ringTip.setPosition(0, 50, 0)
    ringTip.setParent(ringJoint)

    const pinkyBase = new Mesh(new BoxGeometry(20, 20, 20), m5)
    pinkyBase.name = "pinkyBase"
    pinkyBase.setPosition(-90, 90, 0)
    pinkyBase.setParent(palm)

    const pinky = new Mesh(new BoxGeometry(50, 80, 50), m6)
    pinky.name = "pinky"
    pinky.setPosition(0, 40, 0)
    pinky.setParent(pinkyBase)

    const pinkyJoint = new Mesh(new BoxGeometry(20, 20, 20), m5)
    pinkyJoint.name = "pinkyJoint"
    pinkyJoint.setPosition(0, 50, 0)
    pinkyJoint.setParent(pinky)

    const pinkyTip = new Mesh(new BoxGeometry(40, 80, 40), m6)
    pinkyTip.name = "pinkyTip"
    pinkyTip.setPosition(0, 45, 0)
    pinkyTip.setParent(pinkyJoint)

    origin.setParent(scene)
    perspectiveCamera.setParent(origin)
    orthographicCamera.setParent(origin)
    obliqueCamera.setParent(origin)
    // palm.setParent(scene)


    scene.setActiveCamera(PerspectiveCamera)
    return scene
}

export function getDummyScene(canva: HTMLCanvasElement): Scene {
    const scene = new Scene();
    scene.name = "scene"
    const origin = new Node()
    origin.setParent(scene)
    origin.name = "origin"
    const perspectiveCamera = new PerspectiveCamera(
        60,
        canva.width / canva.height,
        0.1,
        20000,
        1)
    perspectiveCamera.name = "PerspectiveCamera"
    perspectiveCamera.setPosition(0, 0, 500)
    perspectiveCamera.setParent(origin)

    const orthographicCamera = new OrthographicCamera(
        -canva.width / 2,
        canva.width / 2,
        canva.height / 2,
        -canva.height / 2,
        -1000,
        +1000
    )
    orthographicCamera.name = "OrthoCamera"
    orthographicCamera.setParent(origin)

    const obliqueCamera = new ObliqueCamera(
        -canva.width / 2,
        canva.width / 2,
        canva.height / 2,
        -canva.height / 2,
        1000,
        -1000
    )
    obliqueCamera.name = "ObliqueCamera"
    obliqueCamera.setParent(origin)

    const m1 = new BasicMaterial(
        Color.BLUE,
        TextureTypes.DIFFUSE_0
    )
    const m2 = new PhongMaterial(
        Color.WHITE,
        Color.WHITE,
        50,
        0.2,
        0.8,
        0.5,
        TextureTypes.DIFFUSE_0,
        TextureTypes.SPECULAR_0,
        TextureTypes.NORMAL_1,
        TextureTypes.DISPLACEMENT_0,
        100,
        0.0
    )
    const m3 = new ParallaxMaterial(
        Color.WHITE,
        Color.WHITE,
        50,
        0.2,
        0.8,
        0.5,
        TextureTypes.DIFFUSE_BRICKS,
        TextureTypes.SPECULAR_0,
        TextureTypes.NORMAL_BRICKS,
        TextureTypes.HEIGHT_BRICKS,
        0.05,
    )
    const m4 = new ReflectionMaterial()
    const m5 = new BasicMaterial(
        Color.BLACK,
        TextureTypes.DIFFUSE_0
    )

    const mesh1 = new Mesh(new BoxGeometry(100, 100, 100), m3);
    mesh1.name = "mesh1"
    mesh1.setParent(scene)

    scene.setActiveCamera(PerspectiveCamera)
    return scene
}