const obraController = require("../controllers/obra-controller");
const router = require("express").Router();
const authorize = require("../configs/authorization");
const roles = require("../helpers/roles.js");

router.get("/:search", obraController.getObras);
router.get("/:id", obraController.getObra);

router.post("", authorize(roles.Admin), obraController.insertObra);
router.put("/:id", authorize(roles.Admin), obraController.updateObra);
router.delete("/:id", authorize(roles.Admin), obraController.removeObra);

module.exports = router;