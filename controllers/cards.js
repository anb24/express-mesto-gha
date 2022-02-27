const Card = require('../models/card');
const { serverError } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => serverError(err, res));
};

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => serverError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .orFail({ message: 'Карточка не найдена', code: 404 })
    .then((card) => res.send(card))
    .catch((err) => serverError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail({ message: 'Карточка не найдена', code: 404 })
    .then((card) => res.send(card))
    .catch((err) => serverError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail({ message: 'Карточка не найдена', code: 404 })
    .then((card) => res.send(card))
    .catch((err) => serverError(err, res));
};
