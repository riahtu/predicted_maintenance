import "../css/Visualizations.css";
import React, { useState } from "react";
import { Dimmer, Segment, Loader } from "semantic-ui-react";

import RefNav from "./VisualizationsHelpers/RefNav";

const Visualizations = props => {
  const [active, setActive] = useState(true);

  const onLoadingViz = () => {
    setActive(false);
  };

  return (
    <div className="refPageLayout">
      <RefNav />
      <Dimmer active={active}>
        <Loader size="massive">Loading Visualizations</Loader>
      </Dimmer>
      <iframe
        onLoad={onLoadingViz}
        className="modelFrame"
        src={`http://direful-skin.surge.sh/?${props.match.params.id}`}
        title="Landing Frame"
      />
    </div>
  );
};

export default Visualizations;
