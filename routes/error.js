const errorRouter = require('express').Router();

errorRouter.all('/*', (req, res) => {
  res.status(404).send('Запрашиваемый ресурс не найден или уничтожен окончательно и бесповоротно! ))' );
});

module.exports = errorRouter;