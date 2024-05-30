const { selectArticleById, selectArticles, updateArticleById, checkArticleExists } = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models")


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [selectArticleById(article_id)];

    if (article_id){
        promises.push(checkArticleExists(article_id));
    }

    Promise.all(promises)
   
        .then((resolvedPromises) => {
            const article = resolvedPromises[0];
            res.status(200).send({article});
        })
        .catch(next)
};

exports.getArticles = (req, res, next) => {
    const { topic } = req.query;

    const promises = [selectArticles({ topic })];

    if (topic) {
        promises.push(checkTopicExists(topic));
    }

    Promise.all(promises)
        .then(([articles]) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};


exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    Promise.all([checkArticleExists(article_id)])
    .then(() => {
        return updateArticleById(inc_votes, article_id)
    })
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
    })
    .catch(next)
};