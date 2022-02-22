const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then(card => res.send(card))
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" })
      }else {
        res.status(500).send({ message: err.message })
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .then(result => {
      if(!result.deletedCount) {
        res.status(404).send({ message: "Карточка не найдена" })
      }else {
        res.send(result)
      }
    })
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },)
    .then(card => {
      if (!card) return res.status(404).send({ message: "Карточка не найдена" } )
        res.send(card)
      })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные"})
      } else {
        res.status(500).send({message: err.message})
      }
    })
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } },
    { new: true },)
    .then(card => {
      if (!card) {
        res.status(404).send({message: 'Карточка не найдена'});
      } else {
        res.send(card);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res.status(400).send({message: "Переданы некорректные данные"})
      }else if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный идентификатор карточки" })
      }
      else {
        res.status(500).send({message: err.message})
      }
    });
};