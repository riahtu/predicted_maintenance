import "../css/ModelFrame.css";
import React from "react";

// Reuseable Component for Models

const ModelFrame = props => {
  return (
    <div className="frameBody">
      <iframe
        className="modelFrame"
        src={props.modelSource}
        title="Landing Frame"
      />
    </div>
  );
};

export default ModelFrame;
