import "../../css/Sensors.css";
import React from "react";

const SensorPump = ({ pumpSensorData, rul }) => {
  console.log("the props in the SensorPump are: ", pumpSensorData);
  return (
    <React.Fragment>
      <div className="topCard">
        <div className="sensVals">
          <p className="sensorValueType">PSI</p>
          <p className="sensorValueNumber">{pumpSensorData.PSI}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">RPM</p>
          <p className="sensorValueNumber">{pumpSensorData.RPM}</p>
        </div>
      </div>

      <div className="bottomCard">
        <div className="sensVals">
          <p className="sensorValueType">Throughout</p>
          <p className="sensorValueNumber">{pumpSensorData.THROUGHPUTPCT}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">Humidity</p>
          <p className="sensorValueNumber">{pumpSensorData.HUMIDITY}</p>
        </div>
      </div>

      <div className="sensRul">
        <div className="rulStyle">
          <p className="sensorValueType">Remaining Useful Life (Days):</p>
          <p className="sensorValueNumber">{rul}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SensorPump;
