const endpointsData = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
    try {
        res.status(200).send(endpointsData);
    } catch (err) {
        next(err);
    }
};



