const path = require("path");
const Camera = require("../models/Camera");

exports.create = (req, res) => {
  return res.status(400).json({ Stream: "Stream error" });
};

exports.test = (req, res) => {
  res.redirect("/login.html");
};

exports.stream = (req, res) => {
  var patientID = req.query.patientID;
  var cameraID = req.query.cameraID;
  exports.cameraGet = (req, res) => {
    Camera.find({ cameraID: req.body.cameraID }, (err, data) => {
      if (data[0].status == "disabled") {
      } else {
        res.render("stream");
      }
    });
  };
};

exports.checkIfStreamEnabled = (req, res) => {
  Camera.findOne({ cameraID: req.query.camera }, (err, data) => {});
};
