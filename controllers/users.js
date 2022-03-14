const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params._id })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then(() => res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректные данные'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      })
      .catch(next);
  });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  // eslint-disable-next-line max-len
  return User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор пользователя'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // eslint-disable-next-line max-len
  return User.findOneAndUpdate({ _id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор пользователя'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      } else {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new UnauthorizedError('Неправильный пароль');
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
          });
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};
