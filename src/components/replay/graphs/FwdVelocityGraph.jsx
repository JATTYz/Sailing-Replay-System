import { useEffect } from 'react';
import Plot from 'react-plotly.js';

const FwdVelocityGraph = ({ time, fwdVelo, isRunning, frameIndex, setFrameIndex }) => {
    useEffect(() => {
        if (isRunning && frameIndex < time.length - 1) {
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
                    y: fwdVelo.slice(0, frameIndex + 1), 
                    type: 'scatter', 
                    marker: { color: 'green' } 
                }]}
                layout={{ 
                    width: 350, 
                    height: 350, 
                    title: 'Foward Velocity', 
                    xaxis: { title: 'Time' }, 
                    yaxis: { title: 'Foward Velocity' }
                }}
            />
        </div>
    );
};

export default FwdVelocityGraph;
