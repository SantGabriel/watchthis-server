const categoriaService = require('../services/categoria-service.js');

exports.getCategorias = (req, res) => {
  new Promise((resolve, reject) => {
    categoriaService
      .getCategorias()
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  })
};

exports.getCategoria = (req, res) => {
  new Promise((resolve, reject) => {
    categoriaService
      .getCategoria(req.params.id)
      .then(result => res.json(result))
      .catch(err => res.status(500).send(err.message));
  })
};