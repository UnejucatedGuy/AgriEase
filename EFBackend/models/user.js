const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    lowercase: true, // Store email addresses in lowercase
    trim: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate email format
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  name: {
    type: String,
    maxlength: 100,
  },
  phoneNumber: {
    type: String,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate phone number format (simple example)
        return /^\d{10}$/.test(value);
      },
      message: "Invalid phone number format",
    },
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    enum: ["farmer", "customer"],
    default: "customer",
    required: true,
  },
  //farmer specific fields
  storeName: {
    type: String,
    maxlength: 100,
  },
  storeDescription: {
    type: String,
    maxlength: 500,
  },
  location: {
    type: String,
    maxlength: 100,
  },
  //customer specific fields
  shoppingCart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
  ],

  // Add other user-specific fields here
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
