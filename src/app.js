const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");

const apiRoutes = require("./api/main");

const app = express();

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    defaultLayout: "main"
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.set("port", process.env.PORT || 3000);

app.use(express.static("public"));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(app.get("port"), () => {
  console.log("App running on port", app.get("port"));
});
module.exports = app;
