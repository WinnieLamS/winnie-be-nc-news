const { selectCommentsById, insertComment, checkCommentExists, removeComment } = require("../models/comments.models")
const { checkArticleExists } = require("../models/articles.models")


exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [selectCommentsById(article_id)];

    if (article_id){
        promises.push(checkArticleExists(article_id))
    }

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comment = resolvedPromises[0];
        res.status(200).send({comment});
    })
    .catch(next);
}

exports.addCommentById = (req, res, next) => {
    const { article_id } = req.params;
    const {username, body} = req.body;


    Promise.all([checkArticleExists(article_id)])
    .then(() => {
        return insertComment(article_id, username, body);
    })
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    });
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    checkCommentExists(comment_id)
    .then(() => removeComment(comment_id))
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
}