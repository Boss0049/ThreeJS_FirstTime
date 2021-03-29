import { WebGLRenderer, Scene, PerspectiveCamera, Color, BoxGeometry, AmbientLight, PCFSoftShadowMap, MeshBasicMaterial, MeshStandardMaterial, Mesh, TextureLoader, SphereGeometry, PointLight, DirectionalLight, PlaneGeometry, FogExp2 } from '/three/build/three.module.js';
import { OrbitControls } from '/three/tools/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js';
//create webGL
const renderer = new WebGLRenderer({ antialias: true });
//create cavas full set size 
renderer.setSize(window.innerWidth, window.innerHeight);
//shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
// นำ canvas มา ใส่ใน html
document.body.appendChild(renderer.domElement);
//สร้าง scene
const scene = new Scene();
// scene.fog = new FogExp2(0x000000, 0.05)

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100.0);
camera.position.set(0, 4, 30)
camera.lookAt(0, 0, 0)

const aLight = new AmbientLight(0xffffff, 10)

const loaders = new GLTFLoader();
loaders.load("models/VikingRoom/scene.gltf", (model) => {
    scene.add(model.scene);
});

const sunLight = new PointLight(0xD8C9AF, 1, 100)


const dirLight = new DirectionalLight(0xffffff, 0.1)
dirLight.position.set(0, 10, 0)
dirLight.castShadow = true

const textureLoader = new TextureLoader();
const sunTexture = textureLoader.load("textures/sun.jpg")
const earthTexture = textureLoader.load("textures/earth.jpg")
const moonTexture = textureLoader.load("textures/moon.jpg")
const starTexture = textureLoader.load("textures/star.jpg")

scene.background = starTexture

const planeGeometry = new PlaneGeometry(100, 100)
const planeMaterial = new MeshStandardMaterial({
    // map: starTexture, 
    color: 0xffffff
})
const floor = new Mesh(planeGeometry, planeMaterial)
//castShadow คือ ทำให้วัสดุเกิดเงา
floor.castShadow = false
//receiveShadow ถ้าเป็น ture คือ อนุญาตให้เงาของObjectอื่นๆ ที่มีเงาสามารถตกกระทบได้ 
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
floor.position.y = -2

const sphereGeometry = new SphereGeometry(1, 32, 32);
const sphereMaterial = new MeshBasicMaterial({ map: sunTexture })
const sun = new Mesh(sphereGeometry, sphereMaterial)
sun.castShadow = true

const earth = sun.clone()
const earthMaterial = new MeshStandardMaterial({ map: earthTexture })
earth.material = earthMaterial
earth.castShadow = true
earth.scale.set(0.2, 0.2, 0.2);

const moon = earth.clone()
const moonMaterial = new MeshStandardMaterial({ map: moonTexture })
moon.material = moonMaterial
moon.castShadow = true
moon.scale.set(0.1, 0.1, 0.1)

scene.add(aLight)

let earthTmr = 0
let moonTmr = 0

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const upFrame = () => {
    requestAnimationFrame(upFrame)
    controls.update();
    earth.position.x = Math.cos(earthTmr) * 3
    earth.position.z = Math.sin(earthTmr) * 3

    moon.position.x = (Math.cos(moonTmr) * 1) + earth.position.x
    moon.position.z = (Math.sin(moonTmr) * 1) + earth.position.z
    earthTmr += 0.01
    moonTmr += 0.05
    renderer.render(scene, camera)
}

upFrame()


