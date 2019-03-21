var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({

  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }

});

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
