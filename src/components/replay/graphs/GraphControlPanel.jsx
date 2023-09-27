import { useReducer, useState } from 'react';
import { useCSVReader } from 'react-papaparse';

import "../../../main.css";

import BoomAngleGraph from './BoomAngleGraph';
import FwdVelocityGraph from './FwdVelocityGraph';
import HeadingGraph from './HeadingGraph';
import HeelAngleGraph from './HeelAngleGraph';
import HikingEffortGraph from './HikingEffortGraph';
import RudderAngleGraph from './RudderAngleGraph';
import WindVelocityGraph from './WindVelocityGraph';

const GraphControlPanel = () => {
    const [boomAngle, setBoomAngle] = useState([]);
    const [fwdVelo, setFwdVelo] = useState([]);
    const [heelAngle, setHeelAngle] = useState([]);
    const [heading, setHeading] = useState([]);
    const [hiking, setHiking] = useState([]);
    const [rudderAngle, setRudderAngle] = useState([]);
    const [time, setTime] = useState([]);
    const [windVelo, setWindVelo] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);
    const [plotsDispState, togglePlotsDispState] = useReducer((_plotsDispState, plotsDispStateChange) => _plotsDispState.includes(plotsDispStateChange.type) ? _plotsDispState.filter(s => s !== plotsDispStateChange.type) : [..._plotsDispState.length === 4 ? _plotsDispState.slice(1) : _plotsDispState, plotsDispStateChange.type], ['BOOM_ANGLE', 'FWD_VELOCITY', 'HEADING', 'HEEL_ANGLE', 'HIKING_EFFORT', 'RUDDER_ANGLE', 'WIND_VELOCITY']);

    const { CSVReader } = useCSVReader();

    const handleData = result => {
        setBoomAngle(result.data.slice(2).map(row => row[8]));
        setFwdVelo(result.data.slice(2).map(row => row[3]));
        setHeelAngle(result.data.slice(2).map(row => row[10]));
        setHeading(result.data.slice(2).map(row => row[7]));
        setHiking(result.data.slice(2).map(row => row[6]));
        setRudderAngle(result.data.slice(2).map(row => row[9]));
        setTime(result.data.slice(2).map(row => row[0]));
        setWindVelo(result.data.slice(2).map(row => row[5]));
        setIsRunning(true);
    };
  
    return (
        <div className="graph_panel">
             <CSVReader onUploadAccepted={handleData}>
                {({ getRootProps, acceptedFile, getRemoveFileProps }) => 
                <div>
                        <button type='button' {...getRootProps()}>Browse file</button>
                        <div>
                            {console.log(getRootProps())}
                        {acceptedFile && acceptedFile.name} 
                        </div>
                        <button {...getRemoveFileProps()}>Remove</button>
                    </div>
                }
            </CSVReader>
            { plotsDispState.map(dispState =>
                dispState === 'BOOM_ANGLE' && <BoomAngleGraph time={time} boomAngle={boomAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            ) }
            <FwdVelocityGraph time={time} fwdVelo={fwdVelo} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            <HeadingGraph time={time} heading={heading} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            <HeelAngleGraph time={time} heelAngle={heelAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            <HikingEffortGraph time={time} hiking={hiking} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            <RudderAngleGraph time={time} rudderAngle={rudderAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            <WindVelocityGraph time={time} windVelo={windVelo} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />            
        </div>
    );
};

export default GraphControlPanel;