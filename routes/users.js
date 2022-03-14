const userRouter = require('express').Router();
const validator = require('validator');
const { Joi, celebrate } = require('celebrate');
const BadRequestError = require('../errors/BadRequestError');

const {
  getUsers, getUserInfo, getUserById, editUser, editUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUser);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Переданы некорректные данные');
    }),
  }),
}), editUserAvatar);

module.exports = userRouter;
