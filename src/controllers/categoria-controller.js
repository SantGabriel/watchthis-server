const categoriaService = require('../services/categoria-service.js');

exports.getCategorias = (req, res) => {
  categoriaService
    .getCategorias()
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
};

exports.getCategoria = (req, res) => {
  categoriaService
    .getCategoria(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
};

//Para popular categorias
/*
exports.insertCategorias = (req, res) => {
  categoriaService
    .insertCategorias(req.body)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err.message));
};*/