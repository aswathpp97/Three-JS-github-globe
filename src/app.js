import * as THREE from "three";
import { AmbientLight, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DEG2RAD } from "three/src/math/MathUtils";
import pixels from "./lat-long-points.json";
import {
  DOT_DENSITY,
  GLOBE_RADIUS,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "./constants";
import { mesh as sphere } from "./objects/globe";
import { mesh as dots } from "./objects/dots";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.add(new AmbientLight(0xbbbbbb, 0.3));
scene.background = new Color(0x040d21);

const object = new THREE.Object3D();
const center = new THREE.Vector3(0, 0, 0);

let c = 0;
for (let lat = 90; lat >= -90; lat -= 1.5) {
  const radius = Math.cos(Math.abs(lat) * DEG2RAD) * GLOBE_RADIUS;
  const circumference = radius * Math.PI * 2;
  const dotsForLat = circumference * DOT_DENSITY;

  for (let x = 0; x < dotsForLat; x++) {
    const long = (x * 360) / dotsForLat;
    const latMap = Math.round(THREE.MathUtils.mapLinear(lat, 0, 180, 90, -90));
    const latRad = lat * DEG2RAD;
    const longRad = long * DEG2RAD;

    let X = GLOBE_RADIUS * Math.cos(latRad) * Math.cos(longRad);
    let Z = GLOBE_RADIUS * Math.cos(latRad) * Math.sin(longRad);
    let Y = GLOBE_RADIUS * Math.sin(latRad);

    if (pixels[`${Math.floor(long)}.${latMap}`] === 1) {
      object.position.x = X;
      object.position.y = Y;
      object.position.z = Z;
      object.lookAt(center);
      dots.setMatrixAt(c, object.matrix);
    }
    c++;
  }
}

dots.scale.x *= -1;

// Camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
camera.updateProjectionMatrix();

// Light
const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
dLight.position.set(-800, 2000, 400);
camera.add(dLight);

const dLight1 = new THREE.DirectionalLight(0x7982f6, 1);
dLight1.position.set(-200, 500, 200);
camera.add(dLight1);

const dLight2 = new THREE.PointLight(0x8566cc, 0.5);
dLight2.position.set(-200, 500, 200);
camera.add(dLight2);

camera.position.z = 400;
camera.position.x = 0;
camera.position.y = 0;

scene.add(sphere);
scene.add(dots);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);

const tick = () => {
  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  // Update sizes
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
