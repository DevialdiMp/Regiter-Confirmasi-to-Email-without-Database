const express = require("express");
const { registerUser, activateUser } = require("../controllers/index");

const router = express.Router();

router.post("/register", registerUser);
router.get("/activate/:token", activateUser);

module.exports = router;