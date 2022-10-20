const express = require("express"),
  mongoose = require("mongoose");

const app = express();

//   MIDDLEWARE to serve static files to the browser
app.use(express.static("public"));

// VIEW ENGINE
app.set("view engine", "ejs");

// DB CONNECTION
const uri = "";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((res) => app.listen(3000))
  .catch((err) => console.log(err));

// ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/posts", (req, res) => res.render("posts"));
