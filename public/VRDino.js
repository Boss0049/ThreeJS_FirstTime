// VR Zombie
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, AnimationMixer, Clock, Object3D,
	PlaneGeometry, BoxGeometry, MeshStandardMaterial, Mesh, TextureLoader, FogExp2,
	DirectionalLight, PointLight, RepeatWrapping, PCFSoftShadowMap
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';
import { GLTFLoader } from '/three/tools/jsm/loaders/GLTFLoader.js';
import { VRButton } from '/three/tools/jsm/webxr/VRButton.js';

// Create WebGL Renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

// Show Stats
let stats = new Stats();

// Add domElement to Body
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);
document.body.appendChild(VRButton.createButton(renderer));

// Create Scene
const scene = new Scene();
//scene.background = new Color(0x000000);
scene.fog = new FogExp2(0x000000, 0.1);

// Create Camera
const dolly = new Object3D();
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
dolly.add(camera);
scene.add(dolly);
dolly.position.set(0, 0.5, 0);

// Create Object
const textureLoader = new TextureLoader();
const gltfLoader = new GLTFLoader();
let model, mixer;
gltfLoader.load("models/vibrantRex.glb", (obj) => {
	model = obj.scene;

	model.traverse((c) => {
		if(c.isMesh){
			c.castShadow = true;
		}
	});

	model.scale.set(0.5, 0.5, 0.5);
	model.position.set(0, 0, -5);
	mixer = new AnimationMixer(model);
	mixer.clipAction(obj.animations[1]).play();
	scene.add(model);
	//console.log(model);
	//console.log(obj.animations);
	//console.log(obj.animations[0].name);
});

function loadTexture(path)
{
	return textureLoader.load("textures/floor/diffuse.jpg", (t) => {
		t.flipY = false;
		t.needsUpdate = true;
		t.wrapS = RepeatWrapping;
		t.wrapT = RepeatWrapping;
		t.repeat.set(5, 5);
	}, undefined, (e) => {console.log("[Error!] can't load texture from url.");});
}

const floor = new Mesh(new PlaneGeometry(50, 50), new MeshStandardMaterial({
	color: 0xffffff,
	map: loadTexture("textures/floor/diffuse.jpg"),
}));
floor.receiveShadow  = true;
floor.rotation.x = -Math.PI/2;
scene.add(floor);

const boxMaterial = new MeshStandardMaterial({
	color: 0xffffff,
	map: textureLoader.load("textures/basicBox.jpg")
});
const box1 = new Mesh(new BoxGeometry(1, 1, 1), boxMaterial);
box1.castShadow = true;
box1.position.set(1, 0.5, 2);
scene.add(box1);
const box2 = box1.clone();
box2.position.set(2, 0.5, -8);
scene.add(box2);
const box3 = box1.clone();
box3.position.set(-5, 0.5, 0);
scene.add(box3);
const box4 = box1.clone();
box4.position.set(6, 0.5, -2);
scene.add(box4);

// Create Lighting
const dirLight = new DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.position.set(5, 20, 10);

dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.bias = -0.00001;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;

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
	if(mixer != undefined) { mixer.update(clock.getDelta()); }
	renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

//updateFrame();
