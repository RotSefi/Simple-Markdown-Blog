// external imports
const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// variable initializations
const dompurify = createDomPurify(new JSDOM().window);

// define model schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  markdown: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  sanitizedHtml: { type: String, required: true },
});

// pre-validation of schema
articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

// exporting model
module.exports = mongoose.model("Article", articleSchema);
