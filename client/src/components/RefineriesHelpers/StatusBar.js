import "./LocationInfo.css";
import React from "react";

// This component is taking in the props.calculation
// it will return the corresponding status bar with calculation
const StatusBar = ({ calculation }) => {
  if (calculation === "Yellow") {
    return (
      <div className="statusBarYellow">
        <br />
      </div>
    );
  } else if (calculation === "Green") {
    return (
      <div className="statusBarGreen">
        <br />
      </div>
    );
  } else if (calculation === "Red") {
    return (
      <div className="statusBarRed">
        <br />
      </div>
    );
  }
};

export default StatusBar;
