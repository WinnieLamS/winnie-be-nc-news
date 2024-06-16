const express = require("express");
const apiRouter = express.Router();

const { getEndpoints } = require("../controllers/endpoints.controllers");
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
