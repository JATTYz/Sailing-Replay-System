/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import waternormals from "../../../public/assets/waternormals.jpg";
import timeAndXYData from "../../data/timeAndXY.json";

let camera, scene, renderer;
let controls, water, sun, northIndicator;
let timeIntervals = [];
let tempCube;

const loader = new GLTFLoader();

class Boat {
  loadingPromise = new Promise((resolve, reject) => {
    loader.load(
      "assets/boat/scene.gltf",
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(17.3285, 1, -29.7828);
        gltf.scene.rotation.y = -1.5;
        this.boat = gltf.scene;
        resolve(this.boat); // Resolve the promise when the object is loaded
      },
      undefined,
      reject
    );
  });

  getObject() {
    return this.loadingPromise;
  }
}

class Flag {
  constructor(x, y) {
    this.x = x; // Store x, y, and z as instance variables
    this.y = y;
  
    this.loadingPromise = new Promise((resolve, reject) => {
      loader.load(
        "assets/flag/scene.gltf",
        (gltf) => {
          scene.add(gltf.scene);
          gltf.scene.scale.set(1, 1, 1); 
          gltf.scene.position.set(this.x, 1, this.y);
          gltf.scene.rotation.y = -1.5;
          this.boat = gltf.scene;
          resolve(this.boat); 
        },
        undefined,
        reject
      );
    });
  }

  getObject() {
    return this.loadingPromise;
  }
}

class Bouy {
  constructor(x, y) {
    this.x = x; // Store x, y, and z as instance variables
    this.y = y;
  
    this.loadingPromise = new Promise((resolve, reject) => {
      loader.load(
        "assets/bouy/scene.gltf",
        (gltf) => {
          scene.add(gltf.scene);
          gltf.scene.scale.set(2, 2, 2); 
          gltf.scene.position.set(this.x, 0, this.y);
          gltf.scene.rotation.y = -1.5;
          this.boat = gltf.scene;
          resolve(this.boat); 
        },
        undefined,
        reject
      );
    });
  }

  getObject() {
    return this.loadingPromise;
  }
}

const boat = new Boat();
const flag1 = new Flag(3,10);
const flag2 = new Flag(3,40);
const mark1 = new Bouy(-50,25);
const mark2 = new Bouy(0,-25);
const mark3 = new Bouy(50,25);

const Replay = ({ canvasRef, upperHalfRef, mapRef }) => {
  useEffect(() => {
    // Access and use the ref in the child component
    if (upperHalfRef.current) {
      init();
    }
  }, []);

  function init() {
    //Temporary cube

    // boat = new Boat(timeAndXYData[1].X_Position, timeAndXYData[1].Y_Position);
    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(
      canvasRef.current.clientWidth,
      mapRef.current.clientHeight
    );
    console.log(canvasRef);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearColor(0x000000);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";

    upperHalfRef.current.appendChild(renderer.domElement);

    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(1, 3, -100);

    // Create the sun vector
    sun = new THREE.Vector3();

    // Create the water geometry
    const waterGeometry = new THREE.PlaneGeometry(3000, 3000);

    // Create the water object
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

    // Set the rotation of the water
    water.rotation.x = -Math.PI / 2;

    // Add the water to the scene
    scene.add(water);

    // Create the sky object
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    // Set the parameters for the sky
    const skyUniforms = sky.material.uniforms;
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    // Set the parameters for the sun
    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    // Create the PMREM generator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    // Update the position of the sun and sky
    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);
      sun.setFromSphericalCoords(1, phi, theta);
      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();
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
    window.addEventListener("resize", onWindowResize);

    // ===== Norh Indicator ======
    const cubeSize = 20;
    const indicatorDistance = 200; // Adjust the distance from the center

    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    northIndicator = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // Position the cube at the north direction
    northIndicator.position.set(0, 50, indicatorDistance);
    scene.add(northIndicator);

    // ===== Temp Cube ======
    const tempCubeSize = 3;

    const tempCubeGeometry = new THREE.BoxGeometry(
      tempCubeSize,
      tempCubeSize,
      tempCubeSize * 2
    );
    const tempCubeMaterial = new THREE.MeshBasicMaterial({ color: 0x800080 });
    tempCube = new THREE.Mesh(tempCubeGeometry, tempCubeMaterial);

    // Position the cube at the north direction
    tempCube.position.set(0, 50, indicatorDistance);
    scene.add(tempCube);

    // ====== load data and create map ======
    const points = [];
    
    for(let i = 1; i < timeAndXYData.length; i++){
      const data = timeAndXYData;
      const currentPosition = data[i];

      if (currentPosition["X_Position"] && currentPosition["Y_Position"] !== null) {
        const xPosition = currentPosition["X_Position"];
        const yPosition = currentPosition["Y_Position"];
        points.push(new THREE.Vector3(-xPosition, 1, yPosition));
      }
    }
   
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 1,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);


    const startingLine = [];
    
    for(let i = 10; i <= 40; i++){
      startingLine.push(new THREE.Vector3(0,0,i))
      startingLine.push(new THREE.Vector3(0,10,i))
    }

    const startingLinegeo = new THREE.BufferGeometry().setFromPoints(startingLine);
   
    const startingLinematerial = new THREE.LineBasicMaterial({
      color: 0xAAFF00,
      linewidth: 3,
    });

    const startline = new THREE.Line(startingLinegeo, startingLinematerial);
    scene.add(startline);

    // Start the animation loop
    animate();
    calculateIntervals();
    moveBoat();
  }

  // Function to handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const renderContainer = document.getElementById("render");
    renderer.setSize(renderContainer.offsetWidth, renderContainer.offsetHeight);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    render();
    controls.update();
  }
  
  // Render function
  function render() {
    const time = performance.now() * 0.001;

    water.material.uniforms["time"].value += 1.0 / 60.0;
    renderer.render(scene, camera);
  }

  // Calculate the time in Milliseconds between each time record point
  function calculateIntervals() {
    const data = timeAndXYData;

    //Retrieve intervals
    for (let i = 2; i < data.length; i++) {
      const interval = data[i].time - data[i - 1].time;
      // console.log(interval);
      timeIntervals.push(interval * 60 * 1000);
    }
  }

  let timeIndex = 0;

  //Recurring function - render position at certain intervals
  function moveBoat() {
    const currentInterval = timeIntervals[timeIndex];
    timeIndex++;

    if (timeIndex < timeIntervals.length) {
      const data = timeAndXYData;
      const currentPosition = data[timeIndex];

      boat.getObject().then((loadedObject) => {
        loadedObject.position.set(
          -currentPosition.X_Position,
          1,
          currentPosition.Y_Position
        );
      });

      setTimeout(moveBoat, currentInterval);
    }
  }

  return <div></div>;
};

export default Replay;
