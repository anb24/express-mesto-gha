const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError, ServerError } = require('../errors/errors');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new ServerError({ message: 'На сервере произошла ошибка' });
      } else {
        res.send(users);
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params._id })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user)
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hach(password, 10).then((hach) => {
    User.create({ name, about, avatar, email, password: hach })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректные данные'));
        } else if (err.name === "MongoError" && err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      })
  })
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Поля "name" и "about" должны быть заполнены' });
  }
  return User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор пользователя'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Поле "avatar" должно быть заполнено' });
  }
  return User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор пользователя'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден.');
      } else {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'my-secret',
          {
            expiresIn: '7d',
          },
        );
        res.send({ token });
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден'});
      } else {
        res.send(user);
      }
    })
    .catch(next)
};