import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IOption, IGlobalShowOptions, ISelection } from "@/type";
import { Sky } from "three/examples/jsm/objects/Sky";
// @ts-ignore
import fontConfig from "three/examples/fonts/helvetiker_bold.typeface.json";
import _ from "lodash";

const SPEED = 4;
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
  sky: Sky | undefined;
  sun: THREE.Vector3 | undefined;

  constructor(options: IGlobalShowOptions) {
    this.name = options.name;
    this.options = options.options;
    this.background = options.backgroundColor;
    this.envInit();
    const _this = this;
    function render() {
      if (!_this.scene || !_this.camera) return;
      requestAnimationFrame(render);
      _this.camera.lookAt(_this.scene.position);

      _this.drawFloor();
      _this.drawElement();
      _this.createText();
      _this.controls?.update();
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
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;

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

    // this.initSky();
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

  jumpFunction(xAxisValue: number) {
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
      const tops: Array<ISelection> = [];
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
          tops.push(selection);
          if (tops.length === options.selectionResult.length) {
            const winnerScore = _.max(tops.map((item) => item.selectedNumber));
            tops
              .filter((item) => item.selectedNumber == winnerScore)
              .forEach((item) => this.createWinnerStyle(item));
          }
        } else {
          const xAsisValue = time * SPEED;
          const { yAxisValue, step } = this.jumpFunction(xAsisValue);
          selection.mesh.position.y = Math.abs(yAxisValue * 0.3);
          if (step == selection.selectedNumber) {
            selection.currentHeight = yAxisValue;
          }
        }
      });
    });
  }

  createWinnerStyle(selection: ISelection) {
    selection.material?.color.set("rgb(255,215,0)");
  }

  initSky() {
    if (!this.scene || !this.renderer || !this.camera) return;
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 2,
      azimuth: 180,
      exposure: this.renderer.toneMappingExposure,
    };

    const uniforms = this.sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(this.sun);

    this.renderer.toneMappingExposure = effectController.exposure;
    this.renderer.render(this.scene, this.camera);
  }

  createText() {
    if (!this.scene) return;
    const loader = new THREE.FontLoader();
    console.log("kankan", fontConfig);
    loader.load(
      fontConfig,
      (font) => {
        console.log("kankan", font);
        const textGeo = new THREE.TextGeometry(this.name, {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 12,
          bevelThickness: 2,
          bevelSize: 5,
          bevelEnabled: true,
        });
        textGeo.computeBoundingBox();
        const centerOffset =
          -0.5 * (textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x);

        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          specular: 0xffffff,
        });

        const mesh = new THREE.Mesh(textGeo, textMaterial);
        mesh.position.x = centerOffset;
        mesh.position.y = -250 + 67;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene?.add(mesh);
      },
      () => {},
      (e) => {
        console.log("ERROR", e);
      },
    );
  }
}
