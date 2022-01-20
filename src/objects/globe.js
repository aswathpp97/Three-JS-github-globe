import * as THREE from "three";

const geometry = new THREE.SphereGeometry(100, 32, 32);

const material = new THREE.MeshStandardMaterial({
  emissive: 0x220038,
  roughness: 0.7,
  color: new THREE.Color(0x24135e),
});

export const mesh = new THREE.Mesh(geometry, material);
