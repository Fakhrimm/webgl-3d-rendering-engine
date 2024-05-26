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
    scene.name = "Fakhri Articulated Model"
    const origin = new Node()
    origin.name = "origin"
    const perspectiveCamera = new PerspectiveCamera(
        60,
        canvas.width / canvas.height,
        0.1,
        20000,
        1)
    perspectiveCamera.name = "PerspectiveCamera"
    perspectiveCamera.setPosition(0, 0, 600)

    const orthographicCamera = new OrthographicCamera(
        -canvas.width / 2,
        canvas.width / 2,
        canvas.height / 2,
        -canvas.height / 2,
        1000,
        -1000
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
    const m2 = new PhongMaterial()
    const m3 = new ParallaxMaterial()
    const m4 = new ReflectionMaterial()

    const palm = new Mesh(new BoxGeometry(260, 160, 50), m3)
    palm.name = "palm"
    palm.setPosition(0, 0, 0)

    const thumb = new Mesh(new BoxGeometry(50, 100, 50), m1)
    thumb.name = "thumb"
    thumb.setPosition(170, 50, 0)
    thumb.setParent(palm)

    const index = new Mesh(new BoxGeometry(50, 100, 50), m1)
    index.name = "index"
    index.setPosition(90, 140, 0)
    index.setParent(palm)

    const littleIndex = new Mesh(new BoxGeometry())

    const middle = new Mesh(new BoxGeometry(50, 100, 50), m1)
    middle.name = "middle"
    middle.setPosition(30, 140, 0)
    middle.setParent(palm)

    const ring = new Mesh(new BoxGeometry(50, 100, 50), m1)
    ring.name = "ring"
    ring.setPosition(-30, 140, 0)
    ring.setParent(palm)

    const pinky = new Mesh(new BoxGeometry(50, 100, 50), m1)
    pinky.name = "pinky"
    pinky.setPosition(-90, 140, 0)
    pinky.setParent(palm)

    origin.setParent(scene)
    perspectiveCamera.setParent(origin)
    orthographicCamera.setParent(origin)
    obliqueCamera.setParent(origin)
    palm.setParent(scene)


    scene.setActiveCamera(PerspectiveCamera)
    return scene
}