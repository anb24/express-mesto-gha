module.exports.serverError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'ValidationError') {
    return res.status(404).send({ message: 'Не найден' });
  }
  else {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};