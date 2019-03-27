var mongoose = require("mongoose");
var DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  doctorID: {
    type: String,
    required: true
  }
});

var Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
