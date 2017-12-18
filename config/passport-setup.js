const passport = require("passport");

const User = require("../models/user-model");


passport.serializeUser((userFromDb, done) => {
  done(null,userFromDb._id);
});

passport.deserializeUser((idFromSession, done) => {
  User.findById(idFromSession)
  .then((userFromDb) => {
      done(null, userFromDb);
  })
  .catch((err) => {
    done(err);
  });
});
