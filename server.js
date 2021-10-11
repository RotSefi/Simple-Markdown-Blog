// imports - core
const path = require("path");

// imports - external
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// imports - own
const articleRouter = require("./routes/articles.js");
const Article = require("./models/article.js");

// activating express app
const app = express();

// connecting to DB
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// setting view-engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// setting up middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// setting up routers
app.use("/articles", articleRouter);

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({});
  res.render("articles/index", { articles });
});

// decalring variables
const PORT = process.env.PORT || 5000;

// activating express server
app.listen(PORT, () => {
  console.log(`server running: http://localhost:${PORT}`);
});
