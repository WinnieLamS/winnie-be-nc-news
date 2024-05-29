const { selectCommentsById } = require("../models/comments.models")


exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsById(article_id)
    .then((article) => {
        res.status(200).send(article);
    })
    .catch((err) => {
        next(err);
    });
}