const express = require('express');
const articleRouter = express.Router();

const { getArticleById, getArticles, patchArticleById } = require("../controllers/articles.controllers");
const { getCommentsById, addCommentById, deleteCommentById } = require("../controllers/comments.controllers");



articleRouter.get("/", getArticles);

articleRouter.route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById);

    articleRouter.route("/:article_id/comments")
    .get(getCommentsById)
    .post(addCommentById);

module.exports = articleRouter;
