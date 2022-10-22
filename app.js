const express = require("express"),
  mongoose = require("mongoose"),
  authRoutes = require("./routes/authRoutes"),
  cookieParser = require("cookie-parser");
// auth middleware
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

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
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/posts", requireAuth, (req, res) => res.render("posts"));
app.use(authRoutes);
