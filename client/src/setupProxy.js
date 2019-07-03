const proxy = require("http-proxy-middleware");

// module.exports = app => {
//   app.use(proxy("/auth", { target: "http://localhost:5000/" }));
//   app.use(proxy("/getuser", { target: "http://localhost:5000" }));
//   app.use(proxy("/logout", { target: "http://localhost:5000/" }));
//   app.use(proxy("/api/authenticated", { target: "http://localhost:5000" }));
//   // app.use(proxy('/signup-sub', { target: 'http://localhost:5000' }));
//   app.use(proxy("/verify", { target: "http://localhost:5000/" }));
// };

const options = {
  target: "http://132.145.168.237:8080",
  router: {
    // when request.headers.host == 'localhost:3000',
    // override target to 'http://localhost:8000'
    'localhost:3000': 'http://localhost:5000'
  }
}

module.exports = app => {
  app.use(proxy("/auth", options));
  app.use(proxy("/getuser", options));
  app.use(proxy("/logout", options));
  app.use(proxy("/api/authenticated", options));
  // app.use(proxy('/signup-sub', options));
  app.use(proxy("/verify", options));
};
