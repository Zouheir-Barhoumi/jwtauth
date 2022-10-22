const JWT = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //   check jwt exists and is valid
  if (token) {
    JWT.verify(
      token,
      "I know half of you half as well as I should like, and I like less than half of you half as well as you deserve.",
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          console.log(decodedToken);
          // carry on with the next middleware
          next();
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  //   check jwt exists and is valid
  if (token) {
    JWT.verify(
      token,
      "I know half of you half as well as I should like, and I like less than half of you half as well as you deserve.",
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user = await User.findById(decodedToken.id);
          //   make user info accessible inside views
          res.locals.user = user;
          // carry on with the next middleware
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
