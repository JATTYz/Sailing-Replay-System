/* eslint-disable no-unused-vars */
import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { Boat } from "./entities/boat";
import waternormals from "./assets/waternormals.jpg";

let camera, scene, renderer;
let controls, water, sun, boat;

const App = () => {
  // ====== Cubes ======
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  async function init() {
    const loader = new GLTFLoader();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    // boat = new Boat(loader, scene);

    // scene.add(boat);

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    // camera.position.set(-17.3285, -29.7828, 100);
    camera.position.set(-17.3285, 3, 100);

    sun = new THREE.Vector3();

    // Water

    const waterGeometry = new THREE.PlaneGeometry(200, 200);

    water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        waternormals,
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();

      scene.environment = pmremGenerator.fromScene(sky).texture;
    }

    updateSun();

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    window.addEventListener("resize", onWindowResize);
  }

  function addNorthIndicator() {
    const cubeSize = 20;
    const indicatorDistance = 200; // Adjust the distance from the center

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const northIndicator = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // Position the cube at the north direction
    northIndicator.position.set(0, -10, indicatorDistance);

    scene.add(northIndicator);
  }

  function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // renderer.render(scene, camera);
    // requestAnimationFrame(animate);
    render();
    // boat.update();
  }

  function render() {
    water.material.uniforms["time"].value += 1.0 / 300.0;

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //// Execute functions

  init();
  addNorthIndicator();
  animate();

  return (
    <>
      <div>HELLO WORLD</div>
    </>
  );
};

export default App;
