import "../css/Navbar.css";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { logout } from "../helpers/auth";
import { AuthContext } from "../context/AuthContext";

const Navbar = props => {
  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let userCheck = JSON.parse(localStorage.getItem("user"));
      // setUser(userCheck.user);
      setState(state => ({ ...state, user: userCheck.user }));
    }
  });

  const renderContext = state => {
    const { fixed } = state;
    if (!state.user) {
      return (
        <div className="nav">
          <Link className="navLink" to="/">
            Home
          </Link>
          <Link className="navLink" to="/about">
            About
          </Link>
          <Button href="/auth" className="loginBtn" basic inverted color="red">
            Log In
          </Button>
        </div>
      );
    }
    return (
      <div className="navLogout">
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

  return <React.Fragment>{renderContext(state)}</React.Fragment>;
};

export default Navbar;
