/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import waternormals from "../../../public/assets/waternormals.jpg";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import course_data from "../../data/course/Triangular_Small.json";

let camera, scene, renderer;
let controls, water, sun, northIndicator;
let timeIntervals = [];

const start_left_X = course_data["Start_left"]["X"];
const start_left_Y = course_data["Start_left"]["Y"];
const start_right_X = course_data["Start_right"]["X"];
const start_right_Y = course_data["Start_right"]["Y"];

const loader = new GLTFLoader();

class Boat {
  loadingPromise = new Promise((resolve, reject) => {
    loader.load(
      "assets/boat/scene.gltf",
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(2, 2, 2);
        //set position based on the boat position.
        gltf.scene.position.set(0, -10, 0);
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

class Operahose {
  loadingPromise = new Promise((resolve, reject) => {
    loader.load(
      "assets/opera-house/scene.gltf",
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(3, 3, 3);
        gltf.scene.position.set(151.24, 2, -33.85);
        gltf.scene.rotation.y = -1.5;
      },
      undefined,
      reject
    );
  });
}

class HarbourBridge {
  loadingPromise = new Promise((resolve, reject) => {
    loader.load(
      "assets/habour-bridge/scene.gltf",
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            const material = child.material;
            // Modify material color here
            const newColor = new THREE.Color(1, 0, 0); // Red
            material.color.set(0x616060);
            material.color.set(0x616060);
          }
        });

        gltf.scene.scale.set(300, 300, 300);
        gltf.scene.position.set(300, 1, 150);
        gltf.scene.rotation.y = -1.5;
        scene.add(gltf.scene);
      },
      undefined,
      reject
    );
  });
}

// const boat = new Boat();

function generateBouy() {
  if (course_data["Top"] != null) {
    const bouy_top_X = course_data["Top"]["X"];
    const bouy_top_Y = course_data["Top"]["Y"];
    new Bouy(bouy_top_X, bouy_top_Y);
  }

  if (course_data["Left"] != null) {
    const bouy_left_X = course_data["Left"]["X"];
    const bouy_left_Y = course_data["Left"]["Y"];
    new Bouy(bouy_left_X, bouy_left_Y);
  }

  if (course_data["Bottom"] != null) {
    const bouy_bottom_X = course_data["Bottom"]["X"];
    const bouy_bottom_Y = course_data["Bottom"]["Y"];
    new Bouy(bouy_bottom_X, bouy_bottom_Y);
  }

  if (course_data["Right"] != null) {
    const bouy_right_X = course_data["Right"]["X"];
    const bouy_right_Y = course_data["Right"]["Y"];
    new Bouy(bouy_right_X, bouy_right_Y);
  }
}

// const operaHouse = new Operahose();

// generateBouy(course_data);

const Replay = ({ canvasRef, upperHalfRef, mapRef, timeAndXYData }) => {
  const boat = new Boat();
  const operaHouse = new Operahose();
  const habourBridge = new HarbourBridge();
  const flag1 = new Flag(start_left_X, start_left_Y);
  const flag2 = new Flag(start_right_X, start_right_Y);
  generateBouy(course_data);
  useEffect(() => {
    // Access and use the ref in the child component
    if (upperHalfRef.current) {
      init();
    }
  }, []);

  function init() {
    //Temporary cube

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer = new THREE.WebGLRenderer({ antialias: true });
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
    camera.position.set(10, 50, -120);

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
      const theta = THREE.MathUtils.degToRad(90);
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
    controls.maxDistance = 1000.0;
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
    // scene.add(northIndicator);

    // ====== load data and create map ======
    const points = [];

    for (let i = 1; i < timeAndXYData.length; i++) {
      const data = timeAndXYData;
      const currentPosition = data[i];

      if (
        currentPosition["X_Position"] &&
        currentPosition["Y_Position"] != null
      ) {
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

    for (let i = start_left_Y; i <= start_right_Y; i++) {
      startingLine.push(new THREE.Vector3(0, 0, i));
      startingLine.push(new THREE.Vector3(-5, 0, i));
    }

    const startingLinegeo = new THREE.BufferGeometry().setFromPoints(
      startingLine
    );

    const startingLinematerial = new THREE.LineBasicMaterial({
      color: 0xaaff00,
      linewidth: 3,
    });

    const startline = new THREE.Line(startingLinegeo, startingLinematerial);
    scene.add(startline);

    const fontLoader = new FontLoader();

    fontLoader.load("fonts/helvetiker_bold.typeface.json", function (font) {
      // const textgeo = new TextGeometry("Starting Point", {
      //   font: font,
      //   size: 3,
      //   height:2
      // })

      // const textMesh = new THREE.Mesh(textgeo)
      // textMesh.castShadow = true
      // textMesh.position.set(-5,0,start_left_X)
      // textMesh.rotateY(0)
      // textMesh.rotateX(50)
      // scene.add(textMesh)

      const textNorth = new TextGeometry("North", {
        font: font,
        size: 20,
        height: 2,
      });

      const northMesh = new THREE.Mesh(textNorth);
      northMesh.castShadow = true;
      northMesh.position.set(0, 50, 200);
      northMesh.rotateY(3);

      const textSouth = new TextGeometry("South", {
        font: font,
        size: 30,
        height: 2,
      });

      const southMesh = new THREE.Mesh(textSouth);
      southMesh.castShadow = true;
      southMesh.position.set(0, 50, -300);
      southMesh.rotateY(0);

      scene.add(northMesh);
      scene.add(southMesh);
    });

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

    water.material.uniforms["time"].value += 1.0 / 150.0;
    renderer.render(scene, camera);
  }

  // Calculate the time in Milliseconds between each time record point
  function calculateIntervals() {
    const data = timeAndXYData;

    if (timeIntervals.length == 0) {
      //Retrieve intervals
      for (let i = 2; i < data.length; i++) {
        const interval = data[i].time - data[i - 1].time;
        // console.log(interval);
        timeIntervals.push(interval * 60 * 1000);
      }
    }
  }

  let timeIndex = 0;

  //Recurring function - render position at certain intervals
  function moveBoat() {
    const currentInterval = timeIntervals[timeIndex];
    timeIndex++;

    if (timeIndex < timeIntervals.length - 1) {
      const data = timeAndXYData;
      const currentPosition = data[timeIndex];

      if (currentPosition) {
        if (currentPosition.X_Position && currentPosition.Y_Position) {
          boat.getObject().then((loadedObject) => {
            if (loadedObject) {
              loadedObject.position.set(
                -currentPosition.X_Position,
                1,
                currentPosition.Y_Position
              );

              // we have to get the heading radians from other variable.
              loadedObject.rotation.y = currentPosition.headingRadians;
            }
          });
        }
      }
      setTimeout(moveBoat, currentInterval);
    }

    return <div></div>;
  }
};

export default Replay;
