import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  PCFSoftShadowMap,
  AmbientLight,
  Skeleton,
  AnimationMixer,
  Clock,
} from "/three/build/three.module.js";
import { OrbitControls } from "/three/tools/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "/three/tools/jsm/loaders/GLTFLoader.js";

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);
const scene = new Scene();

scene.background = new Color(0x202020);
const camera = new PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  100.0
);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

const ambientLight = new AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const cloneModel = (obj) => {
  const clone = {
    animations: obj.animations,
    scene: obj.scene.clone(true),
  };

  const skinnedMeshes = {};

  obj.scene.traverse((c) => {
    if (c.isSkinnedMesh) {
      skinnedMeshes[c.name] = c;
    }
  });

  const cloneBones = {};
  const cloneSkinnedMeshs = {};

  clone.scene.traverse((c) => {
    if (c.isBone) {
      cloneBones[c.name] = c;
    }
    if (c.isSkinnedMesh) {
      cloneSkinnedMeshs[c.name] = c;
    }
  });

  for (let n in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[n];
    const skeleton = skinnedMesh.skeleton;
    const cloneSkinnedMesh = cloneSkinnedMeshs[n];

    const orderedCloneBone = [];

    for (let i = 0; i < skeleton.bones.length; i++) {
      const cloneBone = cloneBones[skeleton.bones[i].name];
      orderedCloneBone.push(cloneBone);
    }

    cloneSkinnedMesh.bind(
      new Skeleton(orderedCloneBone, skeleton.boneInverses),
      cloneSkinnedMesh.matrixWorld
    );
  }

  return clone;
};

const loader = new GLTFLoader();
let mixer1, mixer2, mixer3;
let animIdx = 0;
let rex, rex2;

loader.load("/models/vibrantRex.glb", (model) => {
  rex = cloneModel(model);
  rex.scene.position.x = 4;
  mixer1 = new AnimationMixer(rex.scene);
  mixer1.clipAction(rex.animations[0]).play();

  const rex2 = cloneModel(model);
  rex2.scene.position.x = -4;
  mixer2 = new AnimationMixer(rex2.scene);
  mixer2.clipAction(rex2.animations[0]).play();

  const changeAnimation = () => {
    console.log(true);

    mixer1.clipAction(rex.animations[animIdx%5]).stop();
		mixer2.clipAction(rex2.animations[animIdx%5]).fadeOut(0.2);

		mixer1.clipAction(rex.animations[animIdx%5]).play();
		mixer2.clipAction(rex2.animations[animIdx%5]).reset()
		.setEffectiveTimeScale(0)
		.setEffectiveWeight(1)
		.fadeIn(0.2)
		.play();

    animIdx += 1
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") changeAnimation();
  });

  const rex3 = cloneModel(model);
  rex2.scene.position.x = 8;
  mixer3 = new AnimationMixer(rex3.scene);
  setTimeout(() => mixer3.clipAction(rex3.animations[0]).play(), 1000);

  scene.add(rex.scene, rex2.scene, rex3.scene);
});

const controls = new OrbitControls(camera, renderer.domElement);
const clock = new Clock();

const updateFrame = () => {
  requestAnimationFrame(updateFrame);
  controls.update();

  let delta = clock.getDelta();
  if (mixer1 !== undefined) mixer1.update(delta);
  if (mixer2 !== undefined) mixer2.update(delta);
  if (mixer3 !== undefined) mixer3.update(delta);

  renderer.render(scene, camera);
};

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

updateFrame();
