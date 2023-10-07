/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
// import timeAndXYData from "../data/timeAndXY.json";

const Map = ({ timeAndXYData }) => {
  const [X_AXIS, setX_AXIS] = useState([]);
  const [Y_AXIS, setY_AXIS] = useState([]);
  const timeIntervals = [];

  useEffect(() => {
    // Access and use the ref in the child component
    calculateIntervals();
    moveBoat();
  }, []);

  // Calculate the time in Milliseconds between each time record point
  function calculateIntervals() {
    const data = timeAndXYData;

    //Retrieve intervals
    if (timeIntervals.length == 0) {
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
          setX_AXIS((prevX_AXIS) => [
            ...prevX_AXIS,
            currentPosition.X_Position,
          ]);
          setY_AXIS((prevY_AXIS) => [
            ...prevY_AXIS,
            currentPosition.Y_Position,
          ]);
        }
      }

      setTimeout(moveBoat, currentInterval);
    }
  }

  return (
    <Plot
      data={[
        {
          x: X_AXIS,

          y: Y_AXIS,

          type: "scatter",

          marker: { color: "green" },
        },
      ]}
    />
  );
};

export default Map;
