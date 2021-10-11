// external imports
const express = require("express");

// own imports
const Article = require("../models/article.js");

// variables initialization
const router = express.Router();

// setting up routes (route controllers)
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article });
});

router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    res.render("articles/show", { article });
  } catch (error) {
    res.redirect("/");
    console.log(error.message);
  }
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveAritcleAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    let article = await Article.findById(req.params.id);
    req.article = article;
    next();
  },
  saveAritcleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// generic save and edit article function
function saveAritcleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (error) {
      console.log(error.message);
      res.render(`articles/${path}`, { article });
    }
  };
}

// exporting router
module.exports = router;
