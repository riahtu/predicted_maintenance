import "./RefNav.css";
import React, { useContext, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { logout } from "../../helpers/auth";
import { AuthContext } from "../../context/AuthContext";

const RefNav = props => {
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
    return (
      <div className="refNavLogout">
        <Button
          inverted={!fixed}
          href="/refineries"
          basic
          color="basic"
          className="reflogoutBtn"
        >
          Refineries
        </Button>
        <Button
          inverted={!fixed}
          href="/sensors"
          basic
          color="grey"
          className="reflogoutBtn"
        >
          Equipment
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

export default RefNav;
