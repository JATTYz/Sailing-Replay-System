import { useEffect } from "react";
import Plot from "react-plotly.js";

const BoomAngleGraph = ({
  time,
  boomAngle,
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
            y: boomAngle.slice(0, frameIndex + 1),
            type: "scatter",
            marker: { color: "green" },
          },
        ]}
        layout={{
          height: 350,
          title: "Boom Angle",
          xaxis: { title: "Time" },
          yaxis: { title: "Boom Angle" },
        }}
      />
    </div>
  );
};

export default BoomAngleGraph;
