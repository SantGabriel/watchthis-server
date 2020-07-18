const userService = require("../services/user-service.js");
const jwt = require("../helpers/jwt.js");

exports.register = (req, res) => {
  userService
    .register(req.body.username, req.body.password, req.body.role)
    .then(() => res.status(200).json({ success: true }))
    .catch((message) => res.status(500).send(message));
};
exports.login = (req, res) => {
  userService
    .authenticate(req.body.username, req.body.password)
    .then((payload) => jwt.createToken(payload))
    .then((data) => res.json(data))
    .catch((error) => res.status(500).send(error.message));
};

exports.getItemLista = (req, res) => {
  userService
    .getItemLista(req.client, req.params.id)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err.message));
};

exports.getItensLista = (req, res) => {
  userService
    .getItensLista(req.client, req.params.search ? req.params.search : "")
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err.message));
};

exports.addItemLista = (req, res) => {
  userService
    .addItemLista(req.client, req.params.id)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).send(err.message));
};

exports.updateItemLista = (req, res) => {
  userService
    .updateItemLista(req.client, req.params.id, req.body.nota, req.body.statusItem)
    .then((result) => res.json({ success: true }))
    .catch((err) => res.status(500).send(err.message));
};

exports.removeItemLista = (req, res) => {
  userService
    .removeItemLista(req.client, req.params.id)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).send(err.message));
};
