// Import the required modules
const express = require("express");
const router = express.Router();

const ContactUs = require("../controllers/ContactUs")

router.post('/contact',ContactUs)

module.exports = router;