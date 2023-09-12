/* eslint-disable no-unused-vars */
import React from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import waternormals from "../public/assets/waternormals.jpg"


let camera, scene, renderer;
let controls, water, sun;
const loader = new GLTFLoader();

  class Boat {
    constructor(){
      let boat_position = new THREE.Vector3(0,0,0)
      loader.load("../public/assets/boat/scene.gltf", (gltf) => {
        scene.add( gltf.scene )
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(-17.3285, 1, -29.7828);
        gltf.scene.rotation.y = 0;

        this.boat = gltf.scene
        this.speed = {
          vel: 0,
          rot: 0
        }
      })
    }

    stop(){
      this.speed.vel = 0
      this.speed.rot = 0
    }

    update(){
      if(this.boat){
        this.boat.rotation.y += this.speed.rot
        this.boat.translateX(this.speed.vel)
        
        //print position x,y,z
        // console.log(this.boat.position);
      }
    }

    position(){
      return this.boat.position
    }
  }


const App = () => {

  function init() {
      const boat = new Boat()
      // Create the WebGL renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.setClearColor(0x000000);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.top = '0';
      document.body.appendChild(renderer.domElement);

      // Create the scene
      scene = new THREE.Scene();

      // Create the camera
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(1, 3, -100);
      
      // Create the sun vector
      sun = new THREE.Vector3();

      // Create the water geometry
      const waterGeometry = new THREE.PlaneGeometry(3000, 3000);

      // Create the water object
      water = new Water(
          waterGeometry,
          {
              textureWidth: 512,
              textureHeight: 512,
              waterNormals: new THREE.TextureLoader().load(
                  waternormals, function (texture) {
                  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              }),
              sunDirection: new THREE.Vector3(),
              sunColor: 0xffffff,
              waterColor: 0x001e0f,
              distortionScale: 3.7,
              fog: scene.fog !== undefined
          }
      );

      // Set the rotation of the water
      water.rotation.x = - Math.PI / 2;

      // Add the water to the scene
      scene.add(water);

      // Create the sky object
      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      // Set the parameters for the sky
      const skyUniforms = sky.material.uniforms;
      skyUniforms['turbidity'].value = 10;
      skyUniforms['rayleigh'].value = 2;
      skyUniforms['mieCoefficient'].value = 0.005;
      skyUniforms['mieDirectionalG'].value = 0.8;

      // Set the parameters for the sun
      const parameters = {
          elevation: 2,
          azimuth: 180
      };

      // Create the PMREM generator
      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      // Update the position of the sun and sky
      function updateSun() {
          const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
          const theta = THREE.MathUtils.degToRad(parameters.azimuth);
          sun.setFromSphericalCoords(1, phi, theta);
          sky.material.uniforms['sunPosition'].value.copy(sun);
          water.material.uniforms['sunDirection'].value.copy(sun).normalize();
          scene.environment = pmremGenerator.fromScene(sky).texture;
      }

      // Call the updateSun function
      updateSun();

      // Create orbit controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();


      // Add event listener for window resize
      window.addEventListener('resize', onWindowResize);

      const cubeSize = 20;
      const indicatorDistance = 200; // Adjust the distance from the center

      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const northIndicator = new THREE.Mesh(cubeGeometry, cubeMaterial);

      // Position the cube at the north direction
      northIndicator.position.set(0, 50, indicatorDistance);

      scene.add(northIndicator);
      // Start the animation loop
      animate();

  }

  // Function to handle window resize
  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animation loop
  function animate() {
      requestAnimationFrame(animate);
      render();
      // stats.update();
      controls.update();
  }

  // Render function
  function render() {
      const time = performance.now() * 0.001;
    
      water.material.uniforms['time'].value += 1.0 / 60.0;
      renderer.render(scene, camera);
  }


  init();

  return (
    <>
    <p style={{textAlign: 'center'}}>HELLO WORLD ^_^</p>
    </>
  );
};

export default App;
