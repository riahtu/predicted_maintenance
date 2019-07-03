import React, { useState } from "react";

const AuthContext = React.createContext([{}, () => {}]);

const AuthProvider = props => {
  const [state, setState] = useState({ user: null });
  return (
    <AuthContext.Provider value={[state, setState]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
