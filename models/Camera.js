var mongoose = require("mongoose");
var CameraSchema = new mongoose.Schema({
  cameraID: {
    type: String,
    required: true
  },
  cameraUrl: {
    type: String,
    required: true
  },
  bedNumber: {
    type: Number,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  patientID: {
    type: String
  },
  status: {
    type: String,
    default: "enabled"
  }
});

var Camera = mongoose.model("Camera", CameraSchema);

module.exports = Camera;
