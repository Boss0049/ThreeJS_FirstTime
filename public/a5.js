import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AnimationMixer,
  Clock,
  Color,
  BoxGeometry,
  AmbientLight,
  PCFSoftShadowMap,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
  SphereGeometry,
  PointLight,
  DirectionalLight,
  PlaneGeometry,
  FogExp2,
  SkeletonHelper,
} from "/three/build/three.module.js";
import { OrbitControls } from "/three/tools/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "/three/tools/jsm/loaders/GLTFLoader.js";
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

const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
);
camera.position.set(0, 4, 30);
camera.lookAt(0, 0, 0);

const aLight = new AmbientLight(0xffffff, 4);

const planeGeometry = new PlaneGeometry(100, 100)
const planeMaterial = new MeshStandardMaterial({
    // map: starTexture, 
    color: 0xffffff
})
const floor = new Mesh(planeGeometry,planeMaterial)
floor.rotation.x = -Math.PI / 2

const loaders = new GLTFLoader();
let mixer;
let rex;
loaders.load("models/vibrantRex.glb", (model) => {
  console.log(model);
  rex = model.scene;
  const helper = new SkeletonHelper(rex);
  mixer = new AnimationMixer(rex);
  mixer.clipAction(model.animations[0]).play();
//   mixer.clipAction(model.animations[2]).play();
  scene.add(rex, helper);
});
scene.add(aLight,floor);

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new Clock();
controls.update();

const upFrame = () => {
  requestAnimationFrame(upFrame);
  controls.update();
  if (mixer !== undefined) {
    mixer.update(clock.getDelta());
    rex.position.z += 0.1
    rex.position.x += 0.1
    camera.position.z += 0.1
    camera.position.x += 0.1
  }
  renderer.render(scene, camera);
};

window.addEventListener("resize",( () => {
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth/innerHeight
    camera.updateProjectionMatrix()
}))

upFrame();
