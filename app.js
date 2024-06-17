const cors = require('cors');
const express = require("express");
const app = express();
const apiRouter = require('./routes/api-router')

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', (req, res) => {
    res.status(404).send({msg: "Route Not Found"});
});

  
app.use((err, req, res, next) => {
  if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
  } else if (err.msg && err.status) {
      res.status(err.status).send({ msg: err.msg });
  } else {
      res.status(500).send({ msg: "I am broken :(" });
  }
});
  
module.exports = app;
