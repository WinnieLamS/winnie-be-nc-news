const userRouter = require('express').Router();

const { getUsers } = require("../controllers/users.controllers");

userRouter.get("/", getUsers);

userRouter.get("/:username", getUsers);

module.exports = userRouter;