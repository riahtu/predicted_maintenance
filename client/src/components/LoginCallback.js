import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Login.css";

const getUrlParameter = sParam => {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

export default props => {
  const [success, setSuccess] = useState(null);
  let body = getUrlParameter("code");
  const user = () =>
    axios
      .post("/api/authenticated", {
        code: body
      })
      .then(data => {
        setSuccess("Successfully Logged In");
        localStorage.setItem("user", JSON.stringify(data.data));
        props.history.push("/refineries");
      })
      .catch(error => {
        setSuccess("An error occurred.");
        props.history.push("/error");
      });

  useEffect(() => {
    user();
  }, []);

  return <div className="login-form">{success}</div>;
};
