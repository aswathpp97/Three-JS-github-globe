import * as THREE from "three";
import { COUNT } from "../constants";

const geometry = new THREE.CircleGeometry(0.25, 6);

const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.BackSide,
});

export const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
