// AR Model 360
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color,
	BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';
import { ARButton } from '/three/tools/jsm/webxr/ARButton.js';
//import { FBXLoader } from '/three/tools/jsm/loaders/FBXLoader.js';

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

// Create Camera
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
//camera.position.set(0, 1, 3);
//camera.lookAt(0, 0, 0);

// Create Object
/*let fbxLoader = new FBXLoader();
fbxLoader.load("models/bear/BEAR.fbx", (obj) => {
	scene.add(fbx);
});*/

let boxGeometry = new BoxGeometry(1, 1, 1);
let boxTexture = new TextureLoader().load("textures/basicBox.jpg");
let boxMaterial = new MeshBasicMaterial({
	color: 0xffffff,
	map: boxTexture
});
let boxMesh = new Mesh(boxGeometry, boxMaterial);
boxMesh.position.z = -5;
scene.add(boxMesh);

let speed = 0;

// WebXR Controller
let controller = renderer.xr.getController(0);
controller.addEventListener('select', () => {
	boxMesh.position.set(0, 0, -5).applyMatrix4(controller.matrixWorld);
	boxMesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
});
scene.add(controller);

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

	// Render
	renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

updateFrame();
