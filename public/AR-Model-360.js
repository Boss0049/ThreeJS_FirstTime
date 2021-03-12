// AR Model 360
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color,
	BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, Group,
	AmbientLight, AnimationMixer, Clock
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';
import { ARButton } from '/three/tools/jsm/webxr/ARButton.js';
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js';

// Create WebGL Renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

// Show Stats
let stats = new Stats();

// Add domElement to Body
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);
document.body.appendChild(ARButton.createButton(renderer));

// Create Scene
const scene = new Scene();
scene.background = new Color(0x202020);

// Create Ambient Lighting
let ambientLight = new AmbientLight(0xffffff);
scene.add(ambientLight);

// Create Camera
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
//camera.position.set(0, 1, 3);
//camera.lookAt(0, 0, 0);

// Create Object
let allObj = new Group();
allObj.position.z = -5;

let fbxLoader = new GLTFLoader();
let textureLoader = new TextureLoader();
let model, modelMaterial, mixer;
fbxLoader.load("models/CharacterDemo.glb", (obj) => {
	model = obj.scene;
	model.frustumCulled = false;
	model.position.set(0, -1, -3);

	mixer = new AnimationMixer(model);
	mixer.clipAction(obj.animations[0]).play();

	allObj.add(model);
	//console.log(model);
});

let boxGeometry = new BoxGeometry(1, 1, 1);
let boxTexture = textureLoader.load("textures/basicBox.jpg");
let boxMaterial = new MeshBasicMaterial({
	color: 0xffffff,
	map: boxTexture
});
let boxMesh = new Mesh(boxGeometry, boxMaterial);
allObj.add(boxMesh);

scene.add(allObj);

let speed = 0;

// WebXR Controller
function onSelect()
{
	allObj.position.set(0, 0, -5).applyMatrix4(controller.matrixWorld);
	allObj.quaternion.setFromRotationMatrix(controller.matrixWorld);
}
let controller = renderer.xr.getController(0);
controller.addEventListener('select', onSelect);
scene.add(controller);

let clock = new Clock();

// This function will update every frame
const updateFrame = () =>
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
}

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

updateFrame();
