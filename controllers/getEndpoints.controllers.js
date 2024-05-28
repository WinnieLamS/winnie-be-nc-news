const { selectEndpoints, } = require("../models/endpoints.models");

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      next(err)
    })
}