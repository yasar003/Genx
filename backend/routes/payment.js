const express = require("express");
const {
  processPayment,
  sendRazorpayApi,
} = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/razorpayapi").get(isAuthenticatedUser, sendRazorpayApi);

module.exports = router;
