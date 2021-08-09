import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type Key = number | string;

interface IRenderMesh {
  geometry?: THREE.SphereGeometry;
  material?: THREE.MeshLambertMaterial;
  mesh?: THREE.Mesh;
}
interface IData {
  name: string;
  options: IOption[];
}

interface IOption {
  label: string;
  selectionResult: ISelection[];
}

interface ISelection extends IRenderMesh {
  id: Key;
  label: string;
  selectedNumber: number;
}

interface IGlobalShowOptions extends IData {
  backgroundColor: string;
}

export default class GlobalShow {
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  name: string;
  options: IOption[];
  background: string;
  floorGeometry: THREE.PlaneGeometry | undefined;
  floorMaterial: THREE.MeshLambertMaterial | undefined;
  floor: THREE.Mesh | undefined;
  controls: OrbitControls | undefined;

  constructor(options: IGlobalShowOptions) {
    this.name = options.name;
    this.options = options.options;
    this.background = options.backgroundColor;

    this.envInit();
    this.drawFloor();
    this.drawElement();
  }

  envInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 打开抗锯齿
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.background);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 2.5, 10);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 5, 5);
    this.scene.add(directionalLight);

    this.renderer?.render(this.scene, this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 25;
  }

  drawFloor() {
    if (!this.scene || !this.camera || !this.renderer) return;
    this.floorGeometry = new THREE.PlaneGeometry(5, 5);
    this.floorMaterial = new THREE.MeshLambertMaterial({
      color: 0x4676b6,
    });
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.x = Math.PI * -0.5;
    this.floor.receiveShadow = true;
    this.scene?.add(this.floor);
    this.renderer?.render(this.scene, this.camera);
  }

  drawElement() {
    if (!this.scene || !this.camera || !this.renderer) return;
    this.options.forEach((options, optionsIndex) => {
      options.selectionResult.forEach((selection, selectionIndex) => {
        selection.geometry = new THREE.SphereGeometry(0.3, 32, 16);
        selection.material = new THREE.MeshLambertMaterial({
          color: 0xcccccc,
        });
        selection.geometry.translate(0, 0.3, 0);
        selection.mesh = new THREE.Mesh(selection.geometry, selection.material);
        selection.mesh.castShadow = true;
        this.scene?.add(selection.mesh);
      });
    });
    this.renderer?.render(this.scene, this.camera);
  }
}
