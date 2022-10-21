const User = require("../models/User");

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
    res.status(201).json(user);
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
