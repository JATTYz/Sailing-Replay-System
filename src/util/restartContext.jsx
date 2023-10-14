/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";

const ReplayContext = createContext();

export function RestartProvider({ children }) {
  const [restart, setRestart] = useState(false);

  const restartReplay = () => {
    setRestart(true);
    console.log("restart", restart);
  };

  const setRestartFalse = () => {
    setRestart(false);
    console.log("restart", restart);
  };

  return (
    <ReplayContext.Provider value={{ restartReplay, restart, setRestartFalse }}>
      {children}
    </ReplayContext.Provider>
  );
}

export function useRestart() {
  return useContext(ReplayContext);
}
