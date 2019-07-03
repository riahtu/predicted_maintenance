import "./SensorNav.css";
import React, { useContext, useEffect } from "react";
// import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { logout } from "../../helpers/auth";
import { AuthContext } from "../../context/AuthContext";

const SensorNavs = props => {
  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let userCheck = JSON.parse(localStorage.getItem("user"));
      // setUser(userCheck.user);
      setState(state => ({ ...state, user: userCheck.user }));
    }
  });

  const renderRefContext = state => {
    const { fixed } = state;
    if (!state.user) {
      return (
        <div className="navRefLogin">
          <Button
            href="/auth"
            className="refloginBtn"
            basic
            inverted
            color="red"
          >
            Log In
          </Button>
        </div>
      );
    }

    function onAnalyticsClick() {
      window.location = "/refineries";
    }

    return (
      <div className="refSensorNavLogout">
        <Button
          inverted={!fixed}
          href="https://innovateaccelv2-orasenatdpltoci02.analytics.ocp.oraclecloud.com/dv/ui?pageid=visualAnalyzer&reportpath=%2Fusers%2Fmanta%2FRefinery"
          basic
          className="reflogoutBtn"
          target="_blank"
          onClick={onAnalyticsClick}
        >
          Advanced Analytics
        </Button>

        <Button
          inverted={!fixed}
          href="/refineries"
          basic
          className="reflogoutBtn"
        >
          Refineries
        </Button>

        <Button
          onClick={() => logout()}
          inverted={!fixed}
          href="/logout"
          color="red"
          className="logoutBtn"
        >
          Sign Out
        </Button>
      </div>
    );
  };

  return <React.Fragment>{renderRefContext(state)}</React.Fragment>;
};

export default SensorNavs;
