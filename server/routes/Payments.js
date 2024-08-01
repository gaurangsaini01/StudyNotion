const express = require("express");
const { capturePayment, verifySignature } = require("../controllers/Payments");
const router = express.Router();
const {auth,isStudent} = require("../middlewares/auth")

router.post("/capturepayment", auth, isStudent, capturePayment);
router.post("/verifysignature",auth,isStudent, verifySignature);

module.exports = router