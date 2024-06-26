/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import Replay from "./components/replay/Replay";
import "../src/main.css";
import Map from "./components/Map";
import GraphControlPanel from "./components/replay/graphs/GraphControlPanel";
import Landing from "./components/Landing.jsx";

const App = () => {
  const canvasRef = useRef(null);
  const upperHalfRef = useRef(null);
  const mapRef = useRef(null);
  const [courseData, setCourseData] = useState();
  const [isAssetLoaded, setAssetLoaded] = useState(false);
  const [directionData, setDirectionData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timeAndXYData, setTimeAndXYData] = useState([]);
  const [fwdVelocityData, setFwdVelocityData] = useState([]);
  const [hikingEffectData, setHikingEffectData] = useState([]);
  const [boomAngleData, setBoomAngleData] = useState([]);
  const [heelAngleData, setHeelAngleData] = useState([]);
  const [headingData, setHeadingData] = useState([]);
  const [rudderAngleData, setRudderAngleData] = useState([]);
  const [windVeloData, setWindVeloData] = useState([]);

  return isAssetLoaded ? (
    <div className="container">
      <div className="upper_half" ref={upperHalfRef}>
        <div id="render" ref={canvasRef}>
        {/* <p style={{ position:"absolute", textAlign: "center", }}>HELLO WORLD ^_^</p> */}
          <Replay
            canvasRef={canvasRef}
            upperHalfRef={upperHalfRef}
            mapRef={mapRef}
            courseData={courseData}
            timeAndXYData={timeAndXYData}
          />
        </div>
        <div id="map" ref={mapRef}>
          <Map 
            timeAndXYData={timeAndXYData} 
            courseData={courseData}
            />
        </div>
      </div>
      <div className="lower_half">
        <GraphControlPanel 
          boomAngle={boomAngleData}
          fwdVelo={fwdVelocityData}
          heelAngle={heelAngleData}
          heading={headingData}
          hiking={hikingEffectData}
          rudderAngle={rudderAngleData}
          time={timeData}
          windVelo={windVeloData}
          isAssetLoaded={isAssetLoaded}
        />
      </div>
    </div>
  ) : (
    <Landing
      setAssetLoaded={setAssetLoaded}
      setData={{
        courseData: setCourseData,
        direction: setDirectionData,
        time: setTimeData,
        timeAndXY: setTimeAndXYData,
        fwdVelocity: setFwdVelocityData,
        hikingEffect: setHikingEffectData,
        boomAngle: setBoomAngleData,
        heelAngle: setHeelAngleData,
        heading: setHeadingData,
        rudderAngle: setRudderAngleData,
        windVelo: setWindVeloData
      }}
    />
  );
};

export default App;
