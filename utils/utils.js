module.exports.serverError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Передан невалидный id ' });
  }
  if (err.code === 404) {
    return res.status(404).send({ message: 'Не найден' });
  }

  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};
