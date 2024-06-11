const commentRouter = require('express').Router();

const { getCommentsById, addCommentById, deleteCommentById } = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;