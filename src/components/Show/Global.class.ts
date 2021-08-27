import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IOption, IGlobalShowOptions, ISelection, IGlobal } from "@/type";
import { Sky } from "three/examples/jsm/objects/Sky";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSM } from "three/examples/jsm/csm/CSM";
import { HorseModel, FlamingoModel, fontConfig } from "@/assets/models";
import _ from "lodash";

const SPEED = 4;
export default class GlobalShow implements IGlobal {
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
  mixer: THREE.AnimationMixer | undefined;
  gltfLoader: GLTFLoader;
  csm: CSM | undefined;
  size: number;
  indexSet: Set<number>;
  winnerArray: Set<
    ISelection & {
      optionName: string;
    }
  >;
  container: HTMLDivElement;
  onComplete: (
    list: Array<
      ISelection & {
        optionName: string;
      }
    >,
  ) => void;
  constructor(options: IGlobalShowOptions) {
    options.options.forEach((option, optionIndex) => {
      option.selectionResult.forEach((select, selectIndex) => {
        select.id = `${optionIndex}_${selectIndex}`;
      });
    });
    this.name = options.name;
    this.options = options.options;
    this.background = options.backgroundColor;
    this.gltfLoader = new GLTFLoader();
    this.container = options.container;
    this.size = options.options.length;
    this.winnerArray = new Set<
      ISelection & {
        optionName: string;
      }
    >([]);
    this.indexSet = new Set<number>([]);
    this.onComplete = options.onComplete;
    this.envInit();

    const _this = this;

    function render() {
      if (!_this.scene || !_this.camera) return;
      requestAnimationFrame(render);
      _this.camera.lookAt(_this.scene.position);

      if (_this.indexSet.size !== _this.size) {
        _this.drawElement();
      }

      _this.controls?.update();
      _this.csm?.update();

      _this.renderer?.render(_this.scene, _this.camera);
    }

    render();
  }

  /**
   * 初始化相机 🐣
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );
    this.camera.position.set(5, 5, 20);
  }

  /**
   * 初始化渲染器 🐣
   */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;

    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * 初始化控制器 🐣
   */
  initControls() {
    if (!this.camera || !this.renderer) return;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI / 2.1;
  }

  /**
   * 初始化光源 🐣
   */
  initLight() {
    if (!this.scene) return;
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    ambientLight.castShadow = true;
    this.scene.add(ambientLight);
  }

  /**
   * 初始化地板 🐣
   */
  initCsmAndFloor() {
    if (!this.scene) return;
    this.csm = new CSM({
      maxFar: 1000,
      cascades: 4,
      mode: "practical",
      parent: this.scene,
      shadowMapSize: 1024,
      lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
      camera: this.camera,
    });

    const floorMaterial = new THREE.MeshPhongMaterial({ color: "#252a34" });
    this.csm.setupMaterial(floorMaterial);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000, 8, 8),
      floorMaterial,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = true;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  /**
   * 初始化文字 🐣
   */
  async initText() {
    return new Promise((resolve: (params: () => void) => void) => {
      const loader = new THREE.FontLoader();
      loader.load(fontConfig, (font) => {
        const textGeo = new THREE.TextGeometry(this.name, {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 1.2,
          bevelThickness: 0.2,
          bevelSize: 0.5,
          bevelEnabled: true,
        });
        textGeo.computeBoundingBox();

        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0xe6f7ff,
          specular: 0xffffff,
        });

        const mesh = new THREE.Mesh(textGeo, textMaterial);
        mesh.scale.set(0.2, 0.2, 0.2);
        mesh.position.set(-this.name.length * 1.5, 2.5, -30);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        resolve(() => {
          this.scene?.add(mesh);
        });
      });
    });
  }

  async initAnimals(modelUrl: string, height: number) {
    if (!this.mixer) return;
    return new Promise((resolve: (params: () => void) => void) => {
      this.gltfLoader.load(modelUrl, (gltf) => {
        const mesh = gltf.scene.children[0];
        mesh.scale.set(0.05, 0.05, 0.05);
        mesh.position.set(0, height, -30);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        resolve(() => {
          this.scene?.add(mesh);
        });
      });
    });
  }

  /**
   * 初始化各种环境 🚀
   */
  async envInit() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#454e61");
    this.mixer = new THREE.AnimationMixer(this.scene);

    this.initCamera();
    this.initRenderer();

    await Promise.all([
      this.initText(),
      this.initAnimals(FlamingoModel, 20),
      this.initAnimals(HorseModel, 2.5),
    ]).then((resolves) => {
      resolves.forEach((item) => item?.());
    });

    this.initLight();
    this.initControls();
    this.initCsmAndFloor();

    this.clock = new THREE.Clock(); // 🤔 加一个时钟算动画
  }

  /**
   * 模拟一个实现跳跃的正弦函数的变形 📈
   * @param xAxisValue 代表函数的x轴，这里传入的是时间
   * @returns 当前时间下他的高度
   */
  jumpFunction(xAxisValue: number) {
    const cycle = (5 * Math.PI) / 6;
    const step = parseInt(String(xAxisValue / cycle));
    const value = xAxisValue % cycle;
    return {
      yAxisValue: 2 * Math.sin(value) + step,
      step: step,
    };
  }

  /**
   * 绘制条约的小长方体 🦘
   */
  drawElement() {
    const time = this.clock?.getElapsedTime();
    if (!this.scene || !this.camera || !this.renderer || !time) return;
    this.options.forEach((options, optionsIndex) => {
      const tops: Array<ISelection> = [];
      options.selectionResult.forEach((selection, selectionIndex) => {
        if (!selection.mesh) {
          selection.geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
          selection.material = new THREE.MeshLambertMaterial({
            color: 0xcccccc,
          });
          selection.geometry.translate(
            optionsIndex * 8,
            0.3,
            selectionIndex * 4,
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
            this.indexSet.add(optionsIndex);
            const winnerScore = _.max(tops.map((item) => item.selectedNumber));
            tops
              .filter((item) => item.selectedNumber == winnerScore)
              .forEach((item) => {
                this.createWinnerStyle(item);
                if (
                  !Array.from(this.winnerArray)
                    .map((item) => item.id)
                    .includes(item.id)
                ) {
                  this.winnerArray.add({
                    ...item,
                    optionName: options.label,
                  });
                }
                if (this.indexSet.size === this.size) {
                  setTimeout(() => {
                    this.onComplete?.(Array.from(this.winnerArray));
                  }, 1000);
                }
              });
          }
        } else {
          const xAsisValue = time * SPEED;
          const { yAxisValue, step } = this.jumpFunction(xAsisValue);
          selection.mesh.scale.setY(yAxisValue);
          if (step == selection.selectedNumber) {
            selection.currentHeight = yAxisValue;
          }
        }
      });
    });
  }

  /**
   * 每组的第一名的样式 🏅️
   */
  createWinnerStyle(selection: ISelection) {
    const { material, mesh } = selection;
    if (!material) return;

    material?.color.set("rgb(255,215,0)");
  }

  /**
   * 初始化天空 🐣
   */
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

  remove() {
    this.renderer?.domElement.remove();
  }
}
