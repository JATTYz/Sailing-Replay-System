import { useEffect } from 'react';
import Plot from 'react-plotly.js';

const WindVelocityGraph = ({ time, windVelo, isRunning, frameIndex, setFrameIndex }) => {
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
                data={[{ 
                    x: time.slice(0, frameIndex + 1), 
                    y: windVelo.slice(0, frameIndex + 1), 
                    type: 'scatter', 
                    marker: { color: 'green' } 
                }]}
                layout={{ 
                    width: 350, 
                    height: 350, 
                    title: 'Wind Velocity', 
                    xaxis: { title: 'Time' }, 
                    yaxis: { title: 'Wind Velocity' }
                }}
            />
        </div>
    );
};

export default WindVelocityGraph;
