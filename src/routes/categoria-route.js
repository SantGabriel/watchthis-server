const categoriaController = require('../controllers/categoria-controller');
const router = require('express').Router();

router.get('', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoria);
//Para popular categorias
/*
router.post ('', categoriaController.insertCategorias);
*/
module.exports = router;
