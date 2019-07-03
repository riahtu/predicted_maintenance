import React, { useState } from "react";

export const FormValidator = props => {
  const [hidden, setHidden] = useState(true);
  const [valid, setValid] = useState(true);
  const [validText, setValidText] = useState(null);

  if (
    { email: props.email.length === 0, password: props.password.length === 0 }
  ) {
    setHidden(false);
    setValid(false);
    setValidText({ color: "red" });
  }
  if (!props.email.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    return false;
  }

  return (
    <div className="formValid" style={{ hidden }}>
      <p style={{ validText }}>
        {props.email} is {{ valid }}
      </p>
    </div>
  );
};
