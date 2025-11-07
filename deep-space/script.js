import * as THREE from "https://esm.sh/three";

// Preloader management
class PreloaderManager {
  constructor() {
    this.preloader = document.getElementById("preloader");
    this.mainContent = document.getElementById("main-content");
    this.progressBar = document.querySelector(".progress-bar");
    this.loadingSteps = 0;
    this.totalSteps = 5;
    this.isComplete = false;
  }

  updateProgress(step) {
    this.loadingSteps = Math.min(step, this.totalSteps);
    const percentage = (this.loadingSteps / this.totalSteps) * 100;
    this.progressBar.style.width = `${percentage}%`;
  }

  complete(canvas) {
    if (this.isComplete) return;
    this.isComplete = true;

    this.updateProgress(this.totalSteps);

    setTimeout(() => {
      this.preloader.classList.add("fade-out");
      this.mainContent.classList.add("fade-in");
      canvas.classList.add("fade-in");

      setTimeout(() => {
        this.preloader.style.display = "none";
      }, 1000);
    }, 500);
  }
}

const preloader = new PreloaderManager();
preloader.updateProgress(1);

// Scene setup
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

preloader.updateProgress(2);

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "2";

preloader.updateProgress(3);

// Ghost group
const ghostGroup = new THREE.Group();
scene.add(ghostGroup);

// Ghost geometry
const ghostGeometry = new THREE.SphereGeometry(2, 40, 40);
const ghostMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a90e2,
  transparent: true,
  opacity: 0.8,
  emissive: 0xff4500,
  emissiveIntensity: 3,
  roughness: 0.02
});

const ghostBody = new THREE.Mesh(ghostGeometry, ghostMaterial);
ghostGroup.add(ghostBody);

// Lights
const ambientLight = new THREE.AmbientLight(0x0a0a2e, 0.1);
scene.add(ambientLight);

const rimLight1 = new THREE.DirectionalLight(0x4a90e2, 1.5);
rimLight1.position.set(-8, 6, -4);
scene.add(rimLight1);

const rimLight2 = new THREE.DirectionalLight(0x50e3c2, 1);
rimLight2.position.set(8, -4, -6);
scene.add(rimLight2);

preloader.updateProgress(4);

// Eyes
const eyeGeometry = new THREE.SphereGeometry(0.3, 12, 12);
const leftEyeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0
});
const leftEye = new THREE.Mesh(eyeGeometry, leftEyeMaterial);
leftEye.position.set(-0.7, 0.6, 2.0);
ghostGroup.add(leftEye);

const rightEyeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0
});
const rightEye = new THREE.Mesh(eyeGeometry, rightEyeMaterial);
rightEye.position.set(0.7, 0.6, 2.0);
ghostGroup.add(rightEye);

preloader.updateProgress(5);

// Mouse tracking
const mouse = new THREE.Vector2();
let isMouseMoving = false;

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  isMouseMoving = true;
});

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
let time = 0;
let currentMovement = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);
  
  time += 0.01;

  // Ghost follows mouse
  const targetX = mouse.x * 11;
  const targetY = mouse.y * 7;
  
  ghostGroup.position.x += (targetX - ghostGroup.position.x) * 0.075;
  ghostGroup.position.y += (targetY - ghostGroup.position.y) * 0.075;

  // Floating animation
  const float = Math.sin(time * 1.6) * 0.03;
  ghostGroup.position.y += float;

  // Pulse effect
  const pulse = Math.sin(time * 1.6) * 0.6;
  ghostMaterial.emissiveIntensity = 3 + pulse;

  // Eye glow based on movement
  if (isMouseMoving) {
    currentMovement = Math.min(currentMovement + 0.1, 1);
    isMouseMoving = false;
  } else {
    currentMovement = Math.max(currentMovement - 0.05, 0);
  }

  leftEyeMaterial.opacity = currentMovement;
  rightEyeMaterial.opacity = currentMovement;

  // Wobble
  ghostBody.rotation.y = Math.sin(time * 1.4) * 0.05;

  renderer.render(scene, camera);
}

// Initialize
setTimeout(() => {
  preloader.complete(renderer.domElement);
  animate(0);
}, 100);