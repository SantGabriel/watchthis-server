const obraService = require('../services/obra-service.js');

exports.getObras = (req, res) => {
    obraService
        .getObras(req.params.search)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
};
exports.getObra = (req, res) => {
    obraService
        .getObra(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
};
exports.insertObra = (req, res) => {
    obraService
        .insertObra(req.body)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
};
exports.updateObra = (req, res) => {
    obraService
        .updateObra(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
};
exports.removeObra = (req, res) => {
    obraService
        .removeObra(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
};