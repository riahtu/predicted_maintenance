import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Landing from "./Landing";
import About from "./About";
import Login from "./Login";
import LoginCallback from "./LoginCallback";
import Refineries from "./Refineries";
import Visualizations from "./Visualizations";
import Sensors from "./Sensors";
import PrivateRoute from "../helpers/PrivateRoute";

class App extends React.Component {
  render() {
    console.log("THis is the app component");
    return (
      <AuthProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/about" exact component={About} />
            <Route path="/login" exact component={Login} />
            <Route path="/callback" component={LoginCallback} />
            <PrivateRoute path="/refineries" exact component={Refineries} />
            <PrivateRoute
              path="/refineries/:id"
              exact
              component={Visualizations}
            />
            <PrivateRoute path="/sensors" exact component={Sensors} />
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
