const userRouter = require('express').Router();
const {
  getUsers, getUserInfo, getUserById, editUser, editUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:_id', getUserById);
userRouter.patch('/me', editUser);
userRouter.patch('/me/avatar', editUserAvatar);

module.exports = userRouter;
