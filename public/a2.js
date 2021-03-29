import { WebGLRenderer, Scene, PerspectiveCamera, Color, BoxGeometry, PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, SphereGeometry } from '/three/build/three.module.js';
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
const sunTexture = textureLoader.load("textures/sun.jpg")
const earthTexture = textureLoader.load("textures/earth.jpg")
const moonTexture = textureLoader.load("textures/moon.jpg")
const starTexture = textureLoader.load("textures/star.jpg")

scene.background = starTexture

const sphereGeometry = new SphereGeometry(1, 32, 32);
const sphereMaterial = new MeshBasicMaterial({ map: sunTexture })
const sun = new Mesh(sphereGeometry, sphereMaterial)

const earth = sun.clone()
const earthMaterial = new MeshBasicMaterial({ map: earthTexture })
earth.material = earthMaterial
earth.scale.set(0.2, 0.2, 0.2);

const moon = earth.clone()
const moonMaterial = new MeshBasicMaterial({ map: moonTexture })
moon.material = moonMaterial
moon.scale.set(0.1, 0.1, 0.1)

scene.add(sun, moon, earth)

let earthTmr = 0
let moonTmr = 0
const upFrame = () => {
    requestAnimationFrame(upFrame)

    earth.position.x = Math.cos(earthTmr) * 3
    earth.position.z = Math.sin(earthTmr) * 3

    moon.position.x = (Math.cos(moonTmr) * 1) + earth.position.x
    moon.position.z = (Math.cos(moonTmr) * 1) + earth.position.z
    earthTmr += 0.05
    renderer.render(scene, camera)
}

upFrame()


