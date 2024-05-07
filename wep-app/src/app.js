const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

app.use(express.static("public"));
app.use("/public/", express.static(path.resolve(__dirname, "../public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: "SuperS3cr3TP@ssW0rd",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

const compilerRoutes = require("./routes/compiler_routes");

app.use("/", compilerRoutes);

module.exports = app;
