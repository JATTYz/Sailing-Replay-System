/* eslint-disable no-unused-vars */
import React, { useRef, useState, useCallback } from "react";
import Replay from "./components/replay/Replay";
import "../src/main.css";
import Map from "./components/Map";
import GraphControlPanel from "./components/replay/graphs/GraphControlPanel";
import Landing from "./components/Landing.jsx";
import Controls from "./components/replay/controls/Controls";
import { RestartProvider } from "./util/restartContext";
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

  // make wrapper function to give child

  return isAssetLoaded ? (
    <RestartProvider>
      <div className="container">
        {/* <p style={{ textAlign: "center" }}>HELLO WORLD ^_^</p> */}
        <div className="upper_half" ref={upperHalfRef}>
          <div id="render" ref={canvasRef}>
            <Replay
              canvasRef={canvasRef}
              upperHalfRef={upperHalfRef}
              mapRef={mapRef}
              courseData={courseData}
              timeAndXYData={timeAndXYData}
            />
          </div>
          <div id="map-container" ref={mapRef}>
            <Map
              timeAndXYData={timeAndXYData}
              courseData={courseData}
              id="map"
            />
            <Controls id="controls" />
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
    </RestartProvider>
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
        windVelo: setWindVeloData,
      }}
    />
  );
};

export default App;
