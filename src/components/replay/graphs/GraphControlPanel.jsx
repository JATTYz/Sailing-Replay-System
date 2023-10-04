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

const GraphOptions = ['BOOM_ANGLE', 'FWD_VELOCITY', 'HEADING', 'HEEL_ANGLE', 'HIKING_EFFORT', 'RUDDER_ANGLE', 'WIND_VELOCITY'];

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
    const [plotsDispState, togglePlotsDispState] = useReducer(
        (_plotsDispState, plotsDispStateChange) =>
            _plotsDispState.includes(plotsDispStateChange.type)
                ? _plotsDispState.filter(s => s !== plotsDispStateChange.type)
                : [..._plotsDispState.length === 2 ? _plotsDispState.slice(1) : _plotsDispState, plotsDispStateChange.type],
        ['FWD_VELOCITY', 'WIND_VELOCITY']
    );

    const { CSVReader } = useCSVReader();

    const handleData = sailData => {
        setBoomAngle(sailData.map(row => row[8]));
        setFwdVelo(sailData.map(row => row[3]));
        setHeelAngle(sailData.map(row => row[10]));
        setHeading(sailData.map(row => row[7]));
        setHiking(sailData.map(row => row[6]));
        setRudderAngle(sailData.map(row => row[9]));
        setTime(sailData.map(row => row[0]));
        setWindVelo(sailData.map(row => row[5]));
        setIsRunning(true);
    };
  
    return (
        <div className="graph_panel">
             <CSVReader onUploadAccepted={result => handleData(result.data.slice(1))} accept={`.sbp`}>
                {({ getRootProps, acceptedFile, getRemoveFileProps }) => 
                    <div>
                        <button type="button" {...getRootProps()}>Browse file</button>
                        <p>{acceptedFile && acceptedFile.name}</p>
                        <button type="button" {...getRemoveFileProps()}>Remove</button>
                    </div>
                }
            </CSVReader>
            <div>
                { GraphOptions.map(option =>
                    <p style={{ color: `white` }}>
                        <input type={`checkbox`} name={option} checked={plotsDispState.includes(option)} onChange={event => togglePlotsDispState({ type: event.target.name })} />
                        {option}
                    </p>
                ) }
            </div>
            { plotsDispState.map(dispState =>
                dispState === 'BOOM_ANGLE' && <BoomAngleGraph time={time} boomAngle={boomAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'FWD_VELOCITY' && <FwdVelocityGraph time={time} fwdVelo={fwdVelo} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'HEADING' && <HeadingGraph time={time} heading={heading} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'HEEL_ANGLE' && <HeelAngleGraph time={time} heelAngle={heelAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'HIKING_EFFORT' && <HikingEffortGraph time={time} hiking={hiking} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'RUDDER_ANGLE' && <RudderAngleGraph time={time} rudderAngle={rudderAngle} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
                || dispState === 'WIND_VELOCITY' && <WindVelocityGraph time={time} windVelo={windVelo} isRunning={isRunning} frameIndex={frameIndex} setFrameIndex={setFrameIndex} />
            ) }
        </div>
    );
};

export default GraphControlPanel;