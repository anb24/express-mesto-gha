const errorRouter = require('express').Router();

errorRouter.all('/*', (req, res) => {
  res.status(404).send({ message:'Запрашиваемый ресурс не найден или уничтожен окончательно и бесповоротно! ))'} );
});

module.exports = errorRouter;