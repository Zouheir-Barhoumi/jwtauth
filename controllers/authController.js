const User = require("../models/User"),
  JWT = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const MaxAge = 60 * 60 * 24 * 3;

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: MaxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

  // console.log(email, password);
  // res.send("Login success!");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: MaxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Error Handler
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errorsObj = { email: "", password: "" };

  // Incorrect email
  if (err.message === "Incorrect email") {
    errorsObj.email = "Email is not registered";
  }
  // Incorrect password
  if (err.message === "Incorrect password") {
    errorsObj.password = "That password is incorrect";
  }

  // Duplicate email error
  if (err.code === 11000) {
    errorsObj.email = "That email is already registered... login!";
    return errorsObj;
  }

  // Validation Errors
  if (err.message.includes("user validation failed"))
    Object.values(err.errors).forEach(
      (e) => (errorsObj[e.properties.path] = e.properties.message)
    );

  // console.log(errorsObj);
  return errorsObj;
};

// JSON WEB TOKEN

const createToken = (id) => {
  // JWT.sign(payload, secret, options)
  return JWT.sign({ id }, process.env.SALT, { expiresIn: MaxAge });
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
