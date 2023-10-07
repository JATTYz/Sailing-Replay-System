import { useEffect, useReducer, useState } from "react";

import "../../../main.css";

import BoomAngleGraph from "./BoomAngleGraph";
import FwdVelocityGraph from "./FwdVelocityGraph";
import HeadingGraph from "./HeadingGraph";
import HeelAngleGraph from "./HeelAngleGraph";
import HikingEffortGraph from "./HikingEffortGraph";
import RudderAngleGraph from "./RudderAngleGraph";
import WindVelocityGraph from "./WindVelocityGraph";

const GraphOptions = [
  "BOOM_ANGLE",
  "FWD_VELOCITY",
  "HEADING",
  "HEEL_ANGLE",
  "HIKING_EFFORT",
  "RUDDER_ANGLE",
  "WIND_VELOCITY",
];

const GraphControlPanel = ({
  boomAngle,
  fwdVelo,
  heelAngle,
  heading,
  hiking,
  rudderAngle,
  time,
  windVelo,
  isAssetLoaded,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [proccessTime, setProcessTime] = useState([]);
  const [proccessFwd, setProcessFwd] = useState([]);
  const [proccessHiking, setProcessHiking] = useState([]);
  const [plotsDispState, togglePlotsDispState] = useReducer(
    (_plotsDispState, plotsDispStateChange) =>
      _plotsDispState.includes(plotsDispStateChange.type)
        ? _plotsDispState.filter((s) => s !== plotsDispStateChange.type)
        : [
            ...(_plotsDispState.length === 2
              ? _plotsDispState.slice(1)
              : _plotsDispState),
            plotsDispStateChange.type,
          ],
    ["FWD_VELOCITY", "WIND_VELOCITY"]
  );

  useEffect(() => {
    const timeValue = time.map((_time) => _time.time);
    setProcessTime(timeValue);

    const fwdValue = fwdVelo.map((_fwd) => _fwd.fwd_velocity);
    setProcessFwd(fwdValue);

    const hikingValue = hiking.map((_hiking) => _hiking.hiking_effect);
    setProcessHiking(hikingValue);
  }, []);

  return (
    <div className="graph_panel">
      <div style={{ width: "250px", paddingLeft: "30px" }}>
        {GraphOptions.map((option, i) => (
          <p key={i} style={{ color: `black` }}>
            <input
              type={`checkbox`}
              name={option}
              checked={plotsDispState.includes(option)}
              onChange={(event) =>
                togglePlotsDispState({ type: event.target.name })
              }
            />
            {option}
          </p>
        ))}
      </div>
      <div className="graph_container">
        {plotsDispState.map(
          (dispState) =>
            (dispState === "BOOM_ANGLE" && (
              <BoomAngleGraph
                time={proccessTime}
                boomAngle={boomAngle}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "FWD_VELOCITY" && (
              <FwdVelocityGraph
                time={proccessTime}
                fwdVelo={proccessFwd}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "HEADING" && (
              <HeadingGraph
                time={proccessTime}
                heading={heading}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "HEEL_ANGLE" && (
              <HeelAngleGraph
                time={proccessTime}
                heelAngle={heelAngle}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "HIKING_EFFORT" && (
              <HikingEffortGraph
                time={proccessTime}
                hiking={proccessHiking}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "RUDDER_ANGLE" && (
              <RudderAngleGraph
                time={proccessTime}
                rudderAngle={rudderAngle}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            )) ||
            (dispState === "WIND_VELOCITY" && (
              <WindVelocityGraph
                time={proccessTime}
                windVelo={windVelo}
                isRunning={isAssetLoaded}
                frameIndex={frameIndex}
                setFrameIndex={setFrameIndex}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default GraphControlPanel;
