const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");
const { getCommentsById } = require("./controllers/comments.controllers");






app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);






app.all('*', (req, res) => {
    res.status(404).send({msg: "Route Not Found"});
});

app.use((err, req, res, next) => {
    if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
});
  
app.use((err, req, res, next) => {
    if (err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
});
  
app.use((err, req, res, next) => {
    res.status(500).send({ msg: "I am broken :(" });
});
  
module.exports = app;
