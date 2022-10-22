const express = require("express"),
  mongoose = require("mongoose"),
  authRoutes = require("./routes/authRoutes"),
  cookieParser = require("cookie-parser");

const app = express();

//   MIDDLEWARE
app.use(express.static("public")); // to serve static files to the browser
app.use(express.json());
app.use(cookieParser());

// VIEW ENGINE
app.set("view engine", "ejs");

// DB CONNECTION
const uri =
  "mongodb+srv://zuh:nznr8VPwRwC08a2y@cluster0.wujmzhw.mongodb.net/node-auth";
mongoose
  .connect(uri)
  .then((res) => app.listen(3000))
  .catch((err) => console.log(err));

// ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/posts", (req, res) => res.render("posts"));
app.use(authRoutes);

// COOKIES
app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true");

  res.cookie("newUser", false);
  // 1000ms * 60sec * 60min * 24hour (one day to expire)
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true, // prevent access by javascript
  });

  res.send("You just got your cookies");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});
