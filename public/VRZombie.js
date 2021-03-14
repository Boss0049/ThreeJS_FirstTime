// VR Zombie
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, AnimationMixer, Clock,
	PlaneGeometry, MeshStandardMaterial, Mesh, TextureLoader,
	DirectionalLight, PointLight,
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';
import { FBXLoader } from '/three/tools/jsm/loaders/FBXLoader.js';
import { VRButton } from '/three/tools/jsm/webxr/VRButton.js';

// Create WebGL Renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

// Show Stats
let stats = new Stats();

// Add domElement to Body
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);
document.body.appendChild(VRButton.createButton(renderer));

// Create Scene
const scene = new Scene();
scene.background = new Color(0x202020);

// Create Camera
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
camera.position.set(0, 5, 0);

// Create Object
const textureLoader = new TextureLoader();
const fbxLoader = new FBXLoader();
let model, mixer;
fbxLoader.load("models/zombies/zm01.FBX", (obj) => {
	model = obj;

	let material = new MeshStandardMaterial({
		color: 0xffffff,
		map: textureLoader.load("models/zombies/texA.jpg")
	});

	model.traverse((c) => {
		if(c.isMesh)
		{
			c.material.dispose();
			c.material = material;
		}
	});

	model.scale.set(0.1, 0.1, 0.1);
	model.position.set(0, 0, -5);
	//mixer = new AnimationMixer(model);
	//mixer.clipAction(obj.animations[0]).play();
	scene.add(model);
	//console.log(model);
	console.log(obj.animations);
	//console.log(obj.animations[0].name);
});

const floor = new Mesh(new PlaneGeometry(100, 100), new MeshStandardMaterial({color: 0xffaaff}));
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 20, 10);
scene.add(dirLight);

const pL1 = new PointLight(0xff0000, 0.5, 0, 50);
pL1.position.set(-10, 5, -5);
scene.add(pL1);

const pL2 = new PointLight(0x0000ff, 0.5, 0, 50);
pL2.position.set(10, 5, 10);
scene.add(pL2);

const clock = new Clock();

// This function will update every frame
/*const updateFrame = () =>
{
	requestAnimationFrame(updateFrame);

	// Action
	stats.update();

	//if(mixer != undefined) { mixer.update(clock.getDelta()); }

	// Render
	renderer.render(scene, camera);
}*/

renderer.setAnimationLoop(() => {
	stats.update();
	renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

//updateFrame();
