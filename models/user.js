const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { messageValidEmail } = require('../utils/contants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: '',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, messageValidEmail],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
