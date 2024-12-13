const Razorpay = require("razorpay");
const catchAsyncError = require("../middlewares/catchAsyncError");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Process payment (for Razorpay)
exports.processPayment = catchAsyncError(async (req, res, next) => {
  const options = {
    amount: req.body.amount * 100, // amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1, // Auto-capture payment
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});

// Send Razorpay API key to the frontend
exports.sendRazorpayApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    razorpayApiKey: process.env.RAZORPAY_KEY_ID,
  });
});
