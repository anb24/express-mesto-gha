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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail({ message: 'Пользователь не найден', code: 404 })
    .then((user) => res.send(user))
    .catch((err) => serverError(err, res));
};