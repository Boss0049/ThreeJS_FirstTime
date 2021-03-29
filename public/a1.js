import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader } from '/three/build/three.module.js';
//create webGL
const renderer = new WebGLRenderer({ antialias: true });
//create cavas full set size 
renderer.setSize(window.innerWidth, window.innerHeight);
// นำ canvas มา ใส่ใน html
document.body.appendChild(renderer.domElement);
//สร้าง scene
const scene = new Scene();

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100.0);
camera.position.set(4, 4, 4)
camera.lookAt(0, 0, 0)

const textureLoader = new TextureLoader();
const boxTexture = textureLoader.load("textures/basicBox.jpg")

// const deg = (n) => {
//     return (n/180) * 
// }

const planeGeometry = new PlaneGeometry(2, 2)
const planeMaterial = new MeshBasicMaterial({ map: boxTexture })
const plane = new Mesh(planeGeometry, planeMaterial)
// plane.rotation.x = -Math.PI / 4
plane.rotation.x = -(90 * Math.PI / 180);
plane.scale.set(3, 3)

const boxGeometry = new BoxGeometry(2, 2, 2);
const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
const box = new Mesh(boxGeometry, boxMaterial);
box.scale.set(0.5, 0.5, 0.5)
box.position.x = -2

const boxGeometry2 = new BoxGeometry(1, 1, 1);
const boxMaterial2 = new MeshBasicMaterial({ color: 0xff00ff });
const box2 = new Mesh(boxGeometry2, boxMaterial2);
box.position.x = 2



scene.add(plane, box, box2)

const upFrame = () => {
    requestAnimationFrame(upFrame)

    box.position.y += 0.001
    box.rotation.y += 0.1
    box.rotation.z += 0.1
    box.rotation.x += 0.1

    renderer.render(scene, camera)
}

upFrame()