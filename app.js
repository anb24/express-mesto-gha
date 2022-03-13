const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const users = require('./routes/users');
const cards = require('./routes/cards');
const errorRouter = require('./routes/error');
const { NotFoundError, BadRequestError } = require('./errors/errors');
const errorHandler = require('./middlewares/errorHandler');
const { Joi, celebrate } = require('celebrate');
const { login, createUser } = require('./controllers/users')
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((link) => {
      if (validator.isURL(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequestError('Ошибка: неправильный URL');
    }),
  }),
}), createUser);
app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('/*', errorRouter);
app.use(() => {
  throw new NotFoundError('Ошибка 404');
});
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Запуск сервера на порту: ${PORT}`);
});
