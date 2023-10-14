/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useRestart } from "../../../util/restartContext";

function Controls() {
  const { restartReplay } = useRestart();

  const handleRestartClick = () => {
    // Call the restartJourney function to trigger the restart
    restartReplay();
  };

  return (
    <div className="controlsContainer">
      <button onClick={handleRestartClick}>Restart</button>
    </div>
  );
}

export default Controls;
