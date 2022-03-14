module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).send({ message: message || 'На сервере произошла ошибка' });
  next();
};
