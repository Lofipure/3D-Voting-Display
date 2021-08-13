import * as THREE from "three";

interface IBubbleOptions {
  position: THREE.Vector3;
}

export default class Bubble {
  constructor(options: IBubbleOptions) {
    const geometry = new THREE.SphereGeometry(12, 15, 15);
    const material = new THREE.MeshLambertMaterial({
      transparent: true,
      color: "#4a2b1d",
    });
    const bubble = new THREE.Mesh(geometry, material);
    bubble.castShadow = true;
    bubble.receiveShadow = true;
    bubble.position.set(0, 0, 0);
  }
}
