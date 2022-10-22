const User = require("../models/User"),
  jwt = require("jsonwebtoken");

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send("Login success!");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: MaxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErors(err);
    res.status(400).json({ errors });
  }
};

// Error Handler
const handleErors = (err) => {
  console.log(err.message, err.code);
  let errorsObj = { email: "", password: "" };

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
const MaxAge = 60 * 60 * 24 * 3;

const createToken = (id) => {
  // jwt.sign(payload, secret, options)
  return jwt.sign(
    { id },
    "I know half of you half as well as I should like, and I like less than half of you half as well as you deserve.",
    { expiresIn: MaxAge }
  );
};
