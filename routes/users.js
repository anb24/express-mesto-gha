const userRouter = require('express').Router();
const { getUsers, getUserById, createUser, editUser, editUserAvatar } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:_id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', editUser);
userRouter.patch('/me/avatar', editUserAvatar);

module.exports = userRouter;