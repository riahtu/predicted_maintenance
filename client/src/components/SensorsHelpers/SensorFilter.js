import "../../css/Sensors.css";
import React from "react";

const SensorFilter = ({ filterSensorData, rul }) => {
  console.log("the filterSensorData is: ", filterSensorData);
  return (
    <React.Fragment>
      <div className="topCard">
        <div className="sensVals">
          <p className="sensorValueType">PSI</p>
          <p className="sensorValueNumber">{filterSensorData.PSI}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">RPM</p>
          <p className="sensorValueNumber">{filterSensorData.RPM}</p>
        </div>
      </div>

      <div className="bottomCard">
        <div className="sensVals">
          <p className="sensorValueType">Humidity</p>
          <p className="sensorValueNumber">{filterSensorData.HUMIDITY}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">Temperature</p>
          <p className="sensorValueNumber">{filterSensorData.TEMPRATURE}</p>
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

export default SensorFilter;
