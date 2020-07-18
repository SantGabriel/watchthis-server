const userController = require("../controllers/user-controller");
const router = require("express").Router();
const authorize = require("../configs/authorization");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/itemLista/filtro/:search", authorize(), userController.getItensLista);
router.get("/itemLista/filtro/", authorize(), userController.getItensLista);
router.get("/itemLista/:id", authorize(), userController.getItemLista);
router.put("/itemLista/:id", authorize(), userController.updateItemLista);
router.post("/itemLista/:id", authorize(), userController.addItemLista);
router.delete("/itemLista/:id", authorize(), userController.removeItemLista);

module.exports = router;
