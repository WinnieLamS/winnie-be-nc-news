const endpointsData = require("../endpoints.json");
const { updateEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res, next) => {
    try {
        res.status(200).send(endpointsData);
    } catch (err) {
        next(err);
    }
};

exports.addEndpoint = (req, res, next) => {
  const newData = req.body;
  updateEndpoints(newData)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

