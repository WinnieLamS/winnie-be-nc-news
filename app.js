const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints, addEndpoint } = require("./controllers/endpoints.controllers")
const { getArticleById } = require("./controllers/articles.controllers")


app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.post("/api", addEndpoint);




app.all('*', (req, res) => {
    res.status(404).send({msg: "Route Not Found"})
})



app.use((err, req, res, next) => {
    
    if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
    } else {
      next(err);
    }
  });
  
  app.use((err, req, res, next) => {
    console.log(err);
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