const express = require("express");
const router = express.Router();
const exchangeController = require("../controller/exchangeController");

router.get("/fetchExchanges", exchangeController.getExchanges);
router.get("/fetchExchangeIcons", exchangeController.getExchangeIcons);
router.get("/exchangeList", exchangeController.getNameandIcons);

module.exports = router;
