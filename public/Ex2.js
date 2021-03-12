// Example2
import 
{
	WebGLRenderer, Scene, PerspectiveCamera, Color,
	PlaneGeometry, BoxGeometry, SphereGeometry, MeshBasicMaterial, Mesh
}
from '/three/build/three.module.js';
import Stats from '/three/tools/jsm/libs/stats.module.js';

// Create WebGL Renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

// Show Stats
let stats = new Stats();

// Add domElement to Body
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);

// Create Scene
const scene = new Scene();
scene.background = new Color(0x202020);

// Create Camera
const camera = new PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 100.0);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0.5, 0);

// Create Object
let planeGeometry = new PlaneGeometry(5, 5);
let planeMaterial = new MeshBasicMaterial({color: 0x55ff55});
let planeMesh = new Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI/2;
scene.add(planeMesh);

let planeV = 0;

let boxGeometry = new BoxGeometry(1, 1, 1);
let boxMaterial = new MeshBasicMaterial({color: 0xff0000});
let boxMesh = new Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

let boxV = 0;

let sphereGeometry = new SphereGeometry(0.5, 32, 32);
let sphereMaterial = new MeshBasicMaterial({color: 0x0000ff});
let sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

let sphereV = 0;

// This function will update every frame
const updateFrame = () =>
{
	requestAnimationFrame(updateFrame);

	// Action
	stats.update();

	let planeScale = Math.cos(planeV)*0.1+1;
	planeMesh.scale.set(planeScale, planeScale, planeScale);
	planeV += 0.025;
	
	boxMesh.position.y = Math.cos(boxV)*0.5+1.5;
	boxMesh.rotation.x += 0.01;
	boxMesh.rotation.y += 0.01;
	boxMesh.rotation.z += 0.01;
	boxV += 0.05;

	sphereMesh.position.set(
			Math.cos(sphereV)*1.5,
			0.5,
			Math.sin(sphereV)*1.5
	);
	sphereV += 0.05;

	// Render
	renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});

updateFrame();
