const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  userEmail: String,
  articleId: String,
  url: String,
  title: String,
  description: String
});

const newsModel = mongoose.model('NewsFavourite', newsSchema);
module.exports = newsModel;
