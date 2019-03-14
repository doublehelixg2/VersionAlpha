var mongoose = require("mongoose");

var LogSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientID: {
    type: String,
    required: true
  },
  cameraID: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  relativesList: [{ name: String, phone: Number, email: String }],
  minutes: {
    type: Number,
    required: true
  }
});

var LogSchema = mongoose.model("LogSchema", LogSchema);

module.exports = LogSchema;
