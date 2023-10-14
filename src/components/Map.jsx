/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Crosswind_Small from "../data/course/Crosswind_Small.json";
import Crosswind_Big from "../data/course/Crosswind_Big.json";
import Trapezoid_Small from "../data/course/Trapezoid_Small.json";
import Trapezoid_Big from "../data/course/Trapezoid_Big.json";
import Triangular_Small from "../data/course/Triangular_Small.json";
import Triangular_Big from "../data/course/Triangular_Big.json";
import UpDown_Small from "../data/course/UpDown_Small.json";
import UpDown_Big from "../data/course/UpDown_Big.json";
// import timeAndXYData from "../data/timeAndXY.json";

let course_data;
async function importCourseData(courseData) {
  try {
    switch (courseData) {
      case "1,0":
        course_data = Crosswind_Small;
        break;
      case "1,1":
        course_data = Crosswind_Big;
        break;
      case "2,0":
        course_data = Trapezoid_Small;
        break;
      case "2,1":
        course_data = Trapezoid_Big;
        break;
      case "3,0":
        course_data = Triangular_Small;
        break;
      case "3,1":
        course_data = Triangular_Big;
        break;
      case "4,0":
        course_data = UpDown_Small;
        break;
      case "4,1":
        course_data = UpDown_Big;
        break;
      default:
        console.error("Invalid course data:", courseData);
    }
  } catch (e) {
    console.error(`Error importing JSON data: ${error}`);
  }
}

const Map = ({ timeAndXYData, courseData }) => {
  const [X_AXIS, setX_AXIS] = useState([]);
  const [Y_AXIS, setY_AXIS] = useState([]);
  const timeIntervals = [];

  useEffect(() => {
    importCourseData(courseData);
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

      // console.log(currentPosition);
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

  const plotData = [
    {
      x: X_AXIS,
      y: Y_AXIS,
      type: "scatter",
      marker: { color: "green" },
      showlegend: false,
    },
  ];

  if (course_data == Crosswind_Small || course_data == Crosswind_Big) {
    plotData.push({
      x: [course_data["Left"]["X"]],
      y: [course_data["Left"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });

    plotData.push({
      x: [course_data["Right"]["X"]],
      y: [course_data["Right"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });
  }

  if (course_data == Trapezoid_Small || course_data == Trapezoid_Big) {
    plotData.push({
      x: [course_data["Top"]["X"]],
      y: [course_data["Top"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });

    plotData.push({
      x: [course_data["Left"]["X"]],
      y: [course_data["Left"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });

    plotData.push({
      x: [course_data["Right"]["X"]],
      y: [course_data["Right"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });

    plotData.push({
      x: [course_data["Bottom"]["X"]],
      y: [course_data["Bottom"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });
  }

  if (course_data == Triangular_Small || course_data == Triangular_Big) {
    plotData.push({
      x: [course_data["Top"]["X"]],
      y: [course_data["Top"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
      showlegend: false,
    });

    plotData.push({
      x: [course_data["Left"]["X"]],
      y: [course_data["Left"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
      showlegend: false,
    });

    plotData.push({
      x: [course_data["Bottom"]["X"]],
      y: [course_data["Bottom"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
      showlegend: false,
    });

    plotData.push({
      x: [course_data["Start_left"]["X"], course_data["Start_right"]["X"]],
      y: [course_data["Start_left"]["Y"], course_data["Start_right"]["Y"]],
      type: "scatter",
      mode: "lines",
      line: {
        color: "blue",
        width: 4,
        dash: "dash",
      },
      showlegend: false,
    });
  }
  if (course_data == UpDown_Small || course_data == UpDown_Big) {
    plotData.push({
      x: [course_data["Top"]["X"]],
      y: [course_data["Top"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });

    plotData.push({
      x: [course_data["Bottom"]["X"]],
      y: [course_data["Bottom"]["Y"]],
      type: "scatter",
      mode: "markers",
      marker: {
        color: "red",
        size: 10,
      },
    });
  }

  return (
    <Plot
      data={plotData}
      layout={{
        xaxis: {
          showticklabels: false, // Remove tick labels on the X-axis
        },
        yaxis: {
          showticklabels: false, // Remove tick labels on the Y-axis
        },
      }}
    />
  );
};

export default Map;
