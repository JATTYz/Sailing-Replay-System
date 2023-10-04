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
  const [isAssetLoaded, setAssetLoaded] = useState(false);
  const [directionData, setDirectionData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [timeAndXYData, setTimeAndXYData] = useState([]);
  const [fwdVelocityData, setFwdVelocityData] = useState([]);
  const [hikingEffectData, setHikingEffectData] = useState([]);

  return isAssetLoaded ? (
    <div className="container">
      {/* <p style={{ textAlign: "center" }}>HELLO WORLD ^_^</p> */}
      <div className="upper_half" ref={upperHalfRef}>
        <div id="render" ref={canvasRef}>
          <Replay
            canvasRef={canvasRef}
            upperHalfRef={upperHalfRef}
            mapRef={mapRef}
            timeAndXYData={timeAndXYData}
          />
        </div>
        <div id="map" ref={mapRef}>
          <Map timeAndXYData={timeAndXYData} />
        </div>
      </div>
      <div className="lower_half">
        <GraphControlPanel />
      </div>
    </div>
  ) : (
    <Landing
      setAssetLoaded={setAssetLoaded}
      setData={{
        direction: setDirectionData,
        time: setTimeData,
        timeAndXY: setTimeAndXYData,
        fwdVelocity: setFwdVelocityData,
        hikingEffect: setHikingEffectData,
      }}
    />
  );
};

export default App;
