// ********************************
// Took this from Chris K project from manta
// ********************************

const passport = require("passport"),
  User = require("../models/user"),
  config = require("../config/config"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt,
  LocalStrategy = require("passport-local");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    const setUserInfo = user => {
      let timestamp = new Date().getTime();

      return {
        id: user._id,
        userName: user.userName,
        tenancyId: user.tenancyId,
        compartmentId: user.compartmentId,
        userId: user.userId,
        keyFingerprint: user.keyFingerprint,
        keyPath: user.keyPath,
        iat: timestamp
      };
    };

    let parsedUser = setUserInfo(user);
    done(null, parsedUser);
  });
});

/**
 * Local Login Passport Strategy
 */
const localOptions = { usernameField: "userName" };

const localLogin = new LocalStrategy(localOptions, (userName, done) => {
  console.log(userName);
  User.findOne({ userName: userName }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        error: "Your login details could not be verified. Please try again."
      });
    }
    return done(null, user);
  });
});

/**
 * JSON Web Token Passport Strategy
 */
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.server.APP_SEC
};

const jwtLogin = new JwtStrategy(jwtOptions, (user, done) => {
  User.findById(user.id)
    .then(data => data.toJSON())
    .then(data => {
      let timestamp = new Date().getTime();

      let newUser = {
        id: data._id,
        userName: data.userName,
        tenancyId: data.tenancyId,
        compartmentId: data.compartmentId,
        userId: data.userId,
        keyFingerprint: data.keyFingerprint,
        keyPath: data.keyPath,
        iat: timestamp
      };
      done(null, newUser);
    })
    .catch(error => {
      console.log(error);
    });
});

// Passport instructions
passport.use(localLogin);
passport.use(jwtLogin);
