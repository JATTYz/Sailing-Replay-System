import React from "react";
import { useCSVReader } from "react-papaparse";
import "../../style.css";

const Landing = ({ setAssetLoaded, setData }) => {
  const { CSVReader } = useCSVReader();

  const handleData = (result) => {
    const [metadata, ...sailData] = result.data;

    // console.log("metadata", metadata);
    //Course type = metadata[4]
    // Course big/small = metadata[5]
 
    setData.courseData(`${metadata[4].toString()},${metadata[5].toString()}`);

    setData.time(sailData.map((row) => ({ time: row[0] / 60.0 })));

    setData.direction(
      sailData.map((row) => ({ X_Position: row[1], Y_Position: row[2] }))
    );

    setData.timeAndXY(
      sailData.map((row) => ({
        time: row[0] / 60.0,
        X_Position: row[1],
        Y_Position: row[2],
        headingRadians: ((row[6] * 180) / Math.PI) * (Math.PI / 180),
      }))
    );

    setData.fwdVelocity(
      sailData.map((row) => ({ fwd_velocity: row[6] / -0.3631 }))
    );

    setData.hikingEffect(
      sailData.map((row) => ({ hiking_effect: row[14] }))
    );

    setData.boomAngle(sailData.map(row => row[8]));
    setData.heelAngle(sailData.map(row => row[10]));
    setData.heading(sailData.map(row => row[7]));
    setData.rudderAngle(sailData.map(row => row[9]));
    setData.windVelo(sailData.map(row => row[5]));
  };

  return (
    <div className="row">
      <div id="boat">
        <img src="boat.png" alt={`Boat`} />
      </div>
      <div id="content">
        <br />
        <br />
        <h1>Sail Replay: Relive Your Sailing Experience</h1>
        <br />
        <h3>In Collaboration with:</h3>
        <br />
        <img id="logo" src="logo.png" alt={`Swinburne Logo`} />
        <br />
        <br />
        <br />
        <br />
        <hr />
        <br />
        <h2>Upload SBP file to continue</h2>
        <br />
        <CSVReader onUploadAccepted={handleData} accept={`.sbp`}>
          {({ getRootProps, acceptedFile, getRemoveFileProps }) => (
            <div>
              <button className="button" type="button" {...getRootProps()}>
                Browse...
              </button>
              <br />
              <br />
              {acceptedFile ? (
                <div className="row">
                  <p>{acceptedFile.name}</p>
                  <button
                    className="button"
                    type="button"
                    {...getRemoveFileProps()}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div id="fileStatus">No file selected</div>
              )}
              <br />
              <br />
              <button
                className="upload-button"
                disabled={!acceptedFile}
                onClick={() => setAssetLoaded(true)}
              >
                Upload
              </button>
            </div>
          )}
        </CSVReader>
      </div>
    </div>
  );
};

export default Landing;
