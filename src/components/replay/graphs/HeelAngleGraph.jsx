import { useEffect } from "react";
import Plot from "react-plotly.js";

const HeelAngleGraph = ({
  time,
  heelAngle,
  isRunning,
  frameIndex,
  setFrameIndex,
}) => {
  useEffect(() => {
    if (isRunning && frameIndex < time.length) {
      const timeDifference = time[frameIndex + 1] - time[frameIndex];
      const animationTimeout = setTimeout(() => {
        setFrameIndex(frameIndex + 1);
      }, timeDifference * 60 * 1000);

      return () => clearTimeout(animationTimeout);
    }
  }, [isRunning, frameIndex, time]);

  return (
    <div>
      <Plot
        data={[
          {
            x: time.slice(0, frameIndex + 1),
            y: heelAngle.slice(0, frameIndex + 1),
            type: "scatter",
            marker: { color: "green" },
          },
        ]}
        layout={{
          title: "Heel Angle",
          xaxis: { title: "Time" },
          yaxis: { title: "Heel Angle" },
        }}
      />
    </div>
  );
};

export default HeelAngleGraph;
