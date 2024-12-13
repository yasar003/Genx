const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 130 characters"],
  },
  brand: {
    type: String,
    required: [true, "Please enter product brand name"],
    trim: true,
    maxLength: [50, "Product name cannot exceed 100 characters"],
  },
  actualprice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  owner_ratings: {
    type: Number,
    required: true,
    default: 0,
  },
  ratings: {
    "5stars": { type: Number, default: 0 },
    "4stars": { type: Number, default: 0 },
    "3stars": { type: Number, default: 0 },
    "2stars": { type: Number, default: 0 },
    "1star": { type: Number, default: 0 },
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        "Electronics",
        "Mobile",
        "Laptops",
        "Accessories",
        "Headphones",
        "Shoes",
        "Home",
      ],
      message: "Please select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    min: [0, "Stock cannot be negative"],
    max: [1000, "Stock cannot exceed 1000"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let schema = mongoose.model("Product", productSchema);

module.exports = schema;
