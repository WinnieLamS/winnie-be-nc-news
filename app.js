const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic_controllers")


app.get("/api/topics", getTopics);



app.use((req, res, next) => {
    res.status(404).send({ msg: "Route Not Found" });
  });



// app.use((err, req, res, next) => {
    
//     if (err.code) {
//       res.status(400).send({ msg: "Bad Request" });
//     } else {
//       next(err);
//     }
//   });
  
//   app.use((err, req, res, next) => {
//     console.log(err);
//     if (err.msg) {
//       res.status(err.status).send({ msg: err.msg });
//     } else {
//       next(err);
//     }
//   });
  
//   app.use((err, req, res, next) => {
//     res.status(500).send({ msg: "I am broken :(" });
//   });
  
  module.exports = app;