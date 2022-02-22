const { User } = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports.getUserById = (req, res) => {
  const userId = req.params.id
  User.findOne({ _id: userId })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" });
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный идентификатор пользователя" })
      }else {
        res.status(500).send({ message: err.message })
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
        console.log(err.name);
        if (err.name === "ValidationError") {
          res.status(400).send({ message: "Переданы некорректные данные" })
        }else {
          res.status(500).send({ message: err.message })
        }
    });
}

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" });
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" })
      }else {
        res.status(500).send({ message: err.message })
      }
    });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false
    }
  )
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "Запрашиваемый пользователь не найден" })
      } else {
        res.send(user);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" })
      }else {
        res.status(500).send({ message: err.message })
      }
    });
}