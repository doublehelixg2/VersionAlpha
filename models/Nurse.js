var mongoose = require("mongoose");
var NurseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nurseID: {
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
  }
});

var Nurse = mongoose.model("Nurse", NurseSchema);

module.exports = Nurse;
