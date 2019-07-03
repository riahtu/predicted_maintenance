import "../../css/Sensors.css";
import React from "react";

const SensorBoiler = ({ boilerSensorData, rul }) => {
  console.log("the props in the SensorBoiler are: ", boilerSensorData);
  return (
    <React.Fragment>
      <div className="topCard">
        <div className="sensVals">
          <p className="sensorValueType">PSI</p>
          <p className="sensorValueNumber">{boilerSensorData.PSI}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">Humidity</p>
          <p className="sensorValueNumber">{boilerSensorData.HUMIDITY}</p>
        </div>
      </div>

      <div className="bottomCard">
        <div className="sensVals">
          <p className="sensorValueType">Temperature</p>
          <p className="sensorValueNumber">{boilerSensorData.TEMPRATURE}</p>
        </div>

        <div className="sensVals">
          <p className="sensorValueType">Room Temperature</p>
          <p className="sensorValueNumber">{boilerSensorData.ROOMTEMPRATURE}</p>
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

export default SensorBoiler;
