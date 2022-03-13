const Card = require('../models/card');
const { BadRequestError, ForbiddenError, NotFoundError, ServerError } = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new ServerError({ message: 'На сервере произошла ошибка' });
      } else {
        res.send(cards);
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params.cardId;
  Card.findOneAndDelete({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      const ownerId = card.owner.toString();
      if (ownerId !== userId) {
        throw new ForbiddenError('Нет прав на удаление');
      } else {
        Card.deleteOne({ _id: cardId })
          .then((deletedCard) => {
            res.send(deletedCard);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail({ message: 'Карточка не найдена', code: 404 })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail({ message: 'Карточка не найдена', code: 404 })
    .then((card) => res.send(card))
    .catch(next);
};
