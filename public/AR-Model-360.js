// AR Model 360
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color,
	BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, Group,
	AnimationMixer, Clock,
	DirectionalLight, PointLight
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';
import { ARButton } from '/three/tools/jsm/webxr/ARButton.js';
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js';

const container = document.createElement('div');
document.body.appendChild(container);

// Create WebGL Renderer
const renderer = new WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

// Show Stats
const stats = new Stats();

// Add domElement to Body
container.appendChild(renderer.domElement);
container.appendChild(stats.dom);
document.body.appendChild(ARButton.createButton(renderer));

// Create Scene
const scene = new Scene();
//scene.background = new Color(0x202020);

// Create Camera
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
//camera.position.set(0, 1, 3);
//camera.lookAt(0, 0, 0);

// Create Object
const allObj = new Group();
allObj.position.z = -5;

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 20, 30);
allObj.add(dirLight);

const pL1 = new PointLight(0xff0000, 0.5, 0, 50);
pL1.position.set(-10, 5, -5);
allObj.add(pL1);

const pL2 = new PointLight(0x0000ff, 0.5, 0, 50);
pL2.position.set(10, 5, 10);
allObj.add(pL2);

const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();
let model, mixer;
gltfLoader.load("models/CharacterDemo.glb", (obj) => {
	model = obj.scene;
	model.frustumCulled = false;
	model.position.set(0, -1, -3);

	mixer = new AnimationMixer(model);
	mixer.clipAction(obj.animations[0]).play();

	allObj.add(model);
	//console.log(model);
});

const boxGeometry = new BoxGeometry(1, 1, 1);
const boxTexture = textureLoader.load("textures/basicBox.jpg");
const boxMaterial = new MeshBasicMaterial({
	color: 0xffffff,
	map: boxTexture
});
const boxMesh = new Mesh(boxGeometry, boxMaterial);
allObj.add(boxMesh);

scene.add(allObj);

let speed = 0;

// WebXR Controller

const controller = renderer.xr.getController(0);
controller.addEventListener('select', () => {
	allObj.position.set(0, 0, -5).applyMatrix4(controller.matrixWorld);
	allObj.quaternion.setFromRotationMatrix(controller.matrixWorld);
});
scene.add(controller);

const clock = new Clock();

// This function will update every frame
/*const updateFrame = () =>
{
	requestAnimationFrame(updateFrame);

	// Action
	stats.update();

	boxMesh.position.y = Math.cos(speed)*0.5;
	boxMesh.rotation.x += 0.01;
	boxMesh.rotation.y += 0.01;
	boxMesh.rotation.z += 0.01;
	speed += 0.05;

	if(mixer != undefined) { mixer.update(clock.getDelta()); }

	// Render
	renderer.render(scene, camera);
}*/

renderer.setAnimationLoop(() => {
	// Action
	stats.update();

	boxMesh.position.y = Math.cos(speed)*0.5;
	boxMesh.rotation.x += 0.01;
	boxMesh.rotation.y += 0.01;
	boxMesh.rotation.z += 0.01;
	speed += 0.05;

	if(mixer != undefined) { mixer.update(clock.getDelta()); }

	// Render
	renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

//updateFrame();
