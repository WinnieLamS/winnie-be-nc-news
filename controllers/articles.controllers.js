const { selectArticleById, selectArticles, updateArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({article});
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then((articles) => {

            res.status(200).send({articles});
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleById(inc_votes, article_id)
    .then((updatedArticle) => {
        res.status(202).send({ article: updatedArticle });
    })
        .catch((err) => {
            next(err);
        });
};