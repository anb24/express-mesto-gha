const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { serverError } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => serverError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params._id })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hach(password, 10).then((hach) => {
    User.create({ name, about, avatar, email, password: hach })
      .then((user) => res.send(user))
      .catch((err) => serverError(err, res));
  })
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Поля "name" и "about" должны быть заполнены' });
  }
  return User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Поле "avatar" должно быть заполнено' });
  }
  return User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'my-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден'});
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      res.status(err.message ? 400 : 500).send({ message: err.message || 'Ошибка на Сервере'})
    });
};