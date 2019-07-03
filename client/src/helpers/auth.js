import axios from "axios";

export const requireAuth = (props, next) => {
  axios
    .get("/auth-user")
    .then(data => {
      console.log(data);
    })
    .catch(error => console.log(error));
  if (localStorage.getItem("user")) {
    return props.history.push("/create");
  }
  next();
};

export const logout = next => {
  localStorage.clear();
  next();
};
