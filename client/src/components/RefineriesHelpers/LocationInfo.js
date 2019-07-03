import "./LocationInfo.css";
import React from "react";
import { Link } from "react-router-dom";
import StatusBar from "./StatusBar";
import Countdown from "./Countdown";

const LocationInfo = props => {
  console.log("the forecast is: ", props.forecast);
  console.log("the style is: ", props.onLoad);
  const list = props.refineries.map(refinery => {
    const {
      REID,
      NAME,
      CITY,
      STATE,
      STATUS,
      serviceDate,
      maintenanceDate
    } = refinery;

    const setForecast = () => {
      if (STATUS === "Yellow") {
        console.log("the STATUS is: ", STATUS);
        return (
          <div className="warningContents">
            <div className="circleContents">
              <p className="forecastNumber">{props.forecast}</p>
              <p className="warningText">weeks until service required</p>
            </div>
          </div>
        );
      } else {
        return;
      }
    };

    return (
      <div key={REID} className="locationInfoCard">
        <Link
          to={{
            pathname: `/refineries/${NAME}`,
            state: {
              OperatorName: NAME
            }
          }}
          s
        >
          <StatusBar calculation={STATUS} />
          <div className="locationName">
            <h1 className="locationNameTitle">{NAME}</h1>
            <h3 className="locationStateTitle">
              {CITY}, {STATE}
            </h3>
          </div>

          <div className="bottomRefBody">
            <div className="leftSide">
              <div className="locationBody">D H M S</div>
              <div className="timeStamps">
                <div className="services">
                  Service: <Countdown deadline={serviceDate} />
                </div>
                <div className="services">
                  Maintenance: <Countdown deadline={maintenanceDate} />
                </div>
              </div>
            </div>
            <div className="rightSide">
              <div>{setForecast()}</div>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return <React.Fragment>{list}</React.Fragment>;
};

export default LocationInfo;

// import "./LocationInfo.css";
// import React from "react";
// import { Link } from "react-router-dom";
// import Spinner from "../Spinner";
// import StatusBar from "./StatusBar";
// import Countdown from "./Countdown";
//
// class LocationInfo extends React.Component {
//   constructor(props) {
//     super(props);
//     console.log("the forecast is: ", this.props.forecast);
//     console.log("the style is: ", this.props.onLoad);
//
//     this.state = {
//       isLoading: true
//     };
//   }
//
//   handleOnLoad = () => {
//     this.setState({
//       isLoading: false
//     });
//   };
//
//   list = this.props.refineries.map(refinery => {
//     const {
//       REID,
//       NAME,
//       CITY,
//       STATE,
//       STATUS,
//       serviceDate,
//       maintenanceDate
//     } = refinery;
//
//     const setForecast = () => {
//       if (STATUS === "Yellow") {
//         console.log("the STATUS is: ", STATUS);
//         return (
//           <div className="warningContents">
//             <div className="circleContents">
//               <p className="forecastNumber">{this.props.forecast}</p>
//               <p className="warningText">weeks until service required</p>
//             </div>
//           </div>
//         );
//       } else {
//         return;
//       }
//     };
//
//     const { isLoading } = this.state;
//     let shouldDisplayImage = isLoading ? 0 : null;
//     return (
//       <div
//         onLoad={this.handleOnLoad}
//         style={{ opacity: shouldDisplayImage }}
//         key={REID}
//         className="locationInfoCard"
//       >
//         <Link
//           to={{
//             pathname: `/refineries/${NAME}`,
//             state: {
//               OperatorName: NAME
//             }
//           }}
//           s
//         >
//           <StatusBar calculation={STATUS} />
//           <div className="locationName">
//             <h1 className="locationNameTitle">{NAME}</h1>
//             <h3 className="locationStateTitle">
//               {CITY}, {STATE}
//             </h3>
//           </div>
//
//           <div className="bottomRefBody">
//             <div className="leftSide">
//               <div className="locationBody">D H M S</div>
//               <div className="timeStamps">
//                 <div className="services">
//                   Service: <Countdown deadline={serviceDate} />
//                 </div>
//                 <div className="services">
//                   Maintenance: <Countdown deadline={maintenanceDate} />
//                 </div>
//               </div>
//             </div>
//             <div className="rightSide">
//               <div>{setForecast()}</div>
//             </div>
//           </div>
//         </Link>
//       </div>
//     );
//   });
//
//   render() {
//     return (
//       <div>
//         <div>{this.list}</div>
//       </div>
//     );
//   }
// }
//
// export default LocationInfo;
