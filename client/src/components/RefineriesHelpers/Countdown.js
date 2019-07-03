import "./Countdown.css";
import React, { Component } from "react";

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      time: 0
    };
  }

  componentDidMount() {
    this.getTimeUntil(this.props.deadline);
    this.interval = setInterval(() => {
      this.getTimeUntil(this.props.deadline);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  leadingZero(num) {
    return num < 10 ? "0" + num : num;
  }

  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    this.setState({ days, hours, minutes, seconds, time });
  }

  render() {
    return (
      <div className="thetimer">
        <div className="times clock-days">
          {this.leadingZero(this.state.days)}
        </div>
        <div className="times clock-hours">
          {this.leadingZero(this.state.hours)}
        </div>
        <div className="times clock-minutes">
          {this.leadingZero(this.state.minutes)}
        </div>
        <div className="times clock-seconds">
          {this.leadingZero(this.state.seconds)}
        </div>
      </div>
    );
  }
}

export default Countdown;
