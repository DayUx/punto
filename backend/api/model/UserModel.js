const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
    trim: true,
  },
});

module.exports = mongoose.model("users", userSchema);
