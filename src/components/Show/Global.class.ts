import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IOption, IGlobalShowOptions } from "./type";

const SPEED = 3;
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
  clock: THREE.Clock | undefined;

  constructor(options: IGlobalShowOptions) {
    const _this = this;
    this.name = options.name;
    this.options = options.options;
    this.background = options.backgroundColor;
    this.envInit();

    function render() {
      if (!_this.scene || !_this.camera) return;
      requestAnimationFrame(render);
      _this.controls?.update();
      _this.drawFloor();
      _this.drawElement();
      _this.renderer?.render(_this.scene, _this.camera);
    }

    render();
  }

  envInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.001,
      100,
    );
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 0.01;
    this.controls.maxDistance = 25;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2.1;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.background);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(5, 5, 20);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 5, 5);
    this.scene.add(directionalLight);

    const d = 10;
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 100;

    directionalLight.shadow.mapSize.x = 1024;
    directionalLight.shadow.mapSize.y = 1024;
  }

  drawFloor() {
    if (!this.scene || !this.camera || !this.renderer) return;
    if (this.floor) return;
    this.floorGeometry = new THREE.PlaneGeometry(50, 50);
    this.floorMaterial = new THREE.MeshLambertMaterial({
      color: 0x4676b6,
    });
    this.floorGeometry.translate(1, 1, 0);
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.x = Math.PI * -0.5;
    this.floor.receiveShadow = true;
    this.scene?.add(this.floor);
  }

  func(xAxisValue: number) {
    const cycle = (5 * Math.PI) / 6;
    const step = parseInt(String(xAxisValue / cycle));
    const value = xAxisValue % cycle;
    return {
      yAxisValue: 2 * Math.sin(value) + step,
      step: step,
    };
  }

  drawElement() {
    const time = this.clock?.getElapsedTime();
    if (!this.scene || !this.camera || !this.renderer || !time) return;
    this.options.forEach((options, optionsIndex) => {
      options.selectionResult.forEach((selection, selectionIndex) => {
        if (!selection.mesh) {
          selection.geometry = new THREE.SphereGeometry(0.3, 32, 16);
          selection.material = new THREE.MeshLambertMaterial({
            color: 0xcccccc,
          });
          selection.geometry.translate(
            optionsIndex * 4,
            0.3,
            selectionIndex * 2,
          );

          selection.mesh = new THREE.Mesh(
            selection.geometry,
            selection.material,
          );
          selection.currentHeight = 0;
          selection.mesh.castShadow = true;
          this.scene?.add(selection.mesh);
        } else if (selection.currentHeight) {
          null;
        } else {
          const xAsisValue =
            time * SPEED + optionsIndex * 0.2 + selectionIndex * 0.3;
          const { yAxisValue, step } = this.func(xAsisValue);
          selection.mesh.position.y = Math.abs(yAxisValue * 0.3);
          if (step == selection.selectedNumber) {
            selection.currentHeight = yAxisValue;
          }
        }
      });
    });
  }
}
