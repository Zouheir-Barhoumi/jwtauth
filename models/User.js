const mongoose = require("mongoose"),
  { isEmail } = require("validator"),
  bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Email is not valid!"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters"],
  },
});

// run a function after doc save
userSchema.post("save", (doc, next) => {
  console.log("New user has been created and saved", doc);
  next();
});

// run a function before doc save (don't use arrow function)
// use traditional functions to have access to the 'this' keyword locally (user object)
// we don't get doc because it's still not saved to the DB
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login a user
userSchema.statics.login = async function (email, password) {
  // find by email
  const user = await this.findOne({ email });
  // user found
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    // passwords match
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
    // passwords don't match
    // throw Error("Incorrect email or passord");
  }
  throw Error("Incorrect email");
  // email not in db
};

const User = mongoose.model("user", userSchema);

module.exports = User;
