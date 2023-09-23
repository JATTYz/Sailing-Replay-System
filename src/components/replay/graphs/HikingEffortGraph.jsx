import { useEffect } from 'react';
import Plot from 'react-plotly.js';

const HikingEffortGraph = ({ time, hiking, isRunning, frameIndex, setFrameIndex }) => {
    useEffect(() => {
        if (isRunning && frameIndex < time.length) {
            const timeDifference = time[frameIndex + 1] - time[frameIndex];
            const animationTimeout = setTimeout(() => {
            setFrameIndex(frameIndex + 1);
          }, timeDifference * 1000);
    
          return () => clearTimeout(animationTimeout);
        }
      }, [isRunning, frameIndex, time]);

    return (
        <div>
            <Plot
                data={[{ 
                    x: time.slice(0, frameIndex + 1), 
                    y: hiking.slice(0, frameIndex + 1), 
                    type: 'scatter', 
                    marker: { color: 'green' } 
                }]}
                layout={{ 
                    width: 350, 
                    height: 350, 
                    title: 'Hiking Effort', 
                    xaxis: { title: 'Time' }, 
                    yaxis: { title: 'Hiking Effort' }
                }}
            />
        </div>
    );
};

export default HikingEffortGraph;