const userRouter = require('express').Router();
const { validUpdateUser } = require('../middlewares/validation');
const {
  updateUser, getUserMe,
} = require('../controllers/user');

userRouter.get('/users/me', getUserMe);
userRouter.patch('/users/me', validUpdateUser, updateUser);

module.exports = userRouter;
