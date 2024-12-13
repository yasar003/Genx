const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const bcrypt = require("bcrypt");

//Register User - /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});

//Login User - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //finding the user database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 201, res);
});

//Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Loggedout",
    });
};

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  user.otp = otp; // Store the OTP in the user's document
  user.otpExpire = Date.now() + 10 * 60 * 1000; // Set OTP expiration time to 10 minutes

  // Save OTP and expiration in the user's document
  await user.save({ validateBeforeSave: false });

  // Create transporter object using your Gmail SMTP service
  const transporter = nodemailer.createTransport({
    service: "gmail", // Gmail SMTP service
    auth: {
      user: process.env.SMTP_USER, // Sender's Gmail
      pass: process.env.SMTP_PASS, // App-specific password
    },
  });

  // Email message containing the OTP
  const message = `Your OTP for password recovery is: \n\n ${otp} \n\n This OTP is valid for 10 minutes. If you did not request this email, please ignore it.`;

  const mailOptions = {
    from: process.env.SMTP_USER, // Sender's email
    to: user.email, // User's email
    subject: "GENx Password Recovery - OTP",
    text: message,
  };

  try {
    // Send the email with the OTP
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email}`,
    });
  } catch (error) {
    // Reset OTP fields if email fails to send
    user.otp = undefined;
    user.otpExpire = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message), 500);
  }
});

// OTP Verification - /api/v1/password/otpverification
exports.otpVerification = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body; // Get email and OTP from request body

  // Find the user based on the provided email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Check if the OTP has expired
  if (user.otpExpire < Date.now()) {
    user.otp = undefined; // Clear OTP to prevent reuse
    user.otpExpire = undefined; // Clear OTP expiration
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler("OTP has expired. Please request a new one.", 400)
    );
  }

  // Check if the entered OTP matches the one stored in the database
  if (user.otp !== otp) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  // OTP is valid, clear OTP fields and proceed
  user.otp = undefined;
  user.otpExpire = undefined;

  // Generate reset token using the method from User schema
  const resetPasswordToken = user.getResetToken();
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 3 * 60 * 1000;
  // Save the token and expiration time
  await user.save({ validateBeforeSave: false });

  // Send response with token
  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    token: resetPasswordToken, // Send the reset password token back
  });
});

// Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash the token from the URL to match the stored token
  const resetPasswordToken = req.params.token;
  // Find the user with the matching resetPasswordToken
  const user = await User.findOne({ resetPasswordToken });

  // If the user is not found, return an error
  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  // Check if the token has expired
  if (user.resetPasswordExpire < Date.now()) {
    return next(new ErrorHandler("Password reset token is expired", 400));
  }

  // Check if password and confirmPassword fields are provided
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(
      new ErrorHandler("Please provide both password and confirmPassword", 400)
    );
  }

  // Check if the password and confirmPassword match
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // If everything is valid, hash the new password before saving it
  user.password = password;
  // Clear reset token and expiration time after resetting the password
  user.resetPasswordToken = undefined; // Clear reset token
  user.resetPasswordExpire = undefined; // Clear token expiration

  // Save the updated user document
  await user.save({ validateBeforeSave: false });

  // Send success response
  res.status(200).json({
    success: true,
    message: "Password reset successful",
    user: user,
  });
});

//Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Change Password  - api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  //check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

//Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  let avatar;
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    newUserData = { ...newUserData, avatar };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Admin: Get Specific User - api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Update User - api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  await user.remove();
  res.status(200).json({
    success: true,
  });
});
