import React from "react";
import { Button } from "semantic-ui-react";

// This will determine the status of the specific machine and return the button color as yellow
// if there is maintenance required soon
const WARNING_API_URL = "http://localhost:5000/sensordata/sensorbutton";

class SensorButtonArea extends React.Component {
  state = {
    boilerWarning: "green",
    desalterWarning: "green",
    pumpWarning: "green",
    filterWarning: "green"
  };

  componentDidMount() {
    this.fetchUrl();
  }

  fetchUrl = async () => {
    try {
      const response = await fetch(WARNING_API_URL);
      const json = await response.json();
      const rows = json.rows;
      console.log("THIS IS THE BUTTONS: ", rows);
      this.handleResults(rows);
    } catch (err) {
      console.log(err);
    }
  };

  handleResults = rows => {
    if (rows[0].COUT >= 300) {
      this.setState({
        pumpWarning: "yellow"
      });
    }
    if (rows[1].COUT >= 300) {
      this.setState({
        boilerWarning: "yellow"
      });
    }
    if (rows[2].COUT >= 300) {
      this.setState({
        desalterWarning: "yellow"
      });
    }
    if (rows[5].COUT >= 300) {
      this.setState({
        filterWarning: "yellow"
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Button
          onClick={this.props.onBoilerClick}
          className={`singleButton ${this.state.boilerWarning}`}
          basic={this.state.boilerBasic}
          size="huge"
          inverted
        >
          Boiler
        </Button>
        <Button
          onClick={this.props.onDesalterClick}
          basic={this.state.desalterBasic}
          size="huge"
          inverted
          className={`singleButton ${this.state.desalterWarning}`}
        >
          Desalter
        </Button>
        <Button
          onClick={this.props.onPumpClick}
          className={`singleButton ${this.state.pumpWarning}`}
          basic={this.state.pumpBasic}
          size="huge"
          inverted
        >
          Pump
        </Button>
        <Button
          onClick={this.props.onFilterClick}
          className={`singleButton ${this.state.filterWarning}`}
          basic={this.state.filterBasic}
          size="huge"
          inverted
        >
          Filter
        </Button>
      </React.Fragment>
    );
  }
}

export default SensorButtonArea;
