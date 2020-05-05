const categoriaController = require ('../controllers/categoria-controller');
const router = require ('express').Router ();

router.get ('', categoriaController.getCategorias);
router.get ('/:id', categoriaController.getCategoria);
router.post ('', categoriaController.insertCategoria);
router.put ('/:id', categoriaController.updateCategoria);
router.delete ('/:id', categoriaController.removeCategoria);

module.exports = router;
