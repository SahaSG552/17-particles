import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");
// Particles

const particlesMaterial = new THREE.PointsMaterial({
  color: "yellow",
});

particlesMaterial.sizeAttenuation = true;
particlesMaterial.size = 0.02;

const sphereParticlesGeometry = new THREE.SphereGeometry(1, 16, 50);
const sphereParticles = new THREE.Points(
  sphereParticlesGeometry,
  particlesMaterial
);

scene.add(sphereParticles);

const randomParticlesMaterial = new THREE.PointsMaterial({
  color: "cyan",
});
randomParticlesMaterial.sizeAttenuation = true;
randomParticlesMaterial.size = 0.05;
randomParticlesMaterial.alphaMap = particleTexture;
randomParticlesMaterial.transparent = true;
randomParticlesMaterial.opacity = 1;
randomParticlesMaterial.blending = THREE.AdditiveBlending;
randomParticlesMaterial.depthWrite = false;
randomParticlesMaterial.vertexColors = true;

const randomParticlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = Math.random() * 5;
  colors[i] = Math.random();
}
randomParticlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
randomParticlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

randomParticlesGeometry.center();
const randomParticles = new THREE.Points(
  randomParticlesGeometry,
  randomParticlesMaterial
);
scene.add(randomParticles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphereParticles.rotation.x = elapsedTime;
  sphereParticles.position.y = Math.sin(elapsedTime) + 0.5;

  //randomParticles.rotation.set(elapsedTime, elapsedTime, 0);
  //particlesMaterial.size = Math.sin(Math.random() / 50);

  sphereParticlesGeometry.attributes.position.needsUpdate = true;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = randomParticlesGeometry.attributes.position.array[i3];
    randomParticlesGeometry.attributes.position.array[i3 + 1] =
      Math.sin(elapsedTime + x) + (Math.random() - 0.5) * 0.01;
  }
  randomParticlesGeometry.attributes.position.needsUpdate = true;
  // Update controls
  controls.update();

  // Renderd
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
console.log(sphereParticlesGeometry.attributes.position);
tick();
