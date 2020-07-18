const obraController = require("../controllers/obra-controller");
const router = require("express").Router();
const authorize = require("../configs/authorization");
const roles = require("../helpers/roles.js");

router.get("", obraController.getObras);
router.get("/:id", obraController.getObra);

router.post("", authorize(roles.Boss), obraController.insertObra);
router.put("/:id", authorize(roles.Boss), obraController.updateObra);
router.delete("/:id", authorize(roles.Boss), obraController.removeObra);

module.exports = router;