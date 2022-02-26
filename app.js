const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const errorRouter = require('./routes/error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/users', users);
app.use('/cards', cards);
app.use('/*', errorRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '6214da24357a3737511133ae' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Запуск сервера на порту: ${PORT}`);
});