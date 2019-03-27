const User = require("../models/User");
const Camera = require("../models/Camera");
const creds = require("../creds");
const axios = require("axios");
var fs = require("fs");

exports.main = (req, res) => {
   // res.render('DoubleHelix/index' , { email: req.session.userEmail });
   //checkLogin(req,res);
   res.render("index");
};

exports.test = (req, res) => {
   var data = "New File Contents";
   Camera.find((err, data) => writeFM2(res, data));
};

//Test login
exports.direct = (req, res) => {
   var user = "bhatshravan3@yahoo.com";
   logs(user + " giving direct login");
   User.findOne({ email: user }, (err, data) => {
      req.session.userId = data._id;
      req.session.userEmail = data.email;
      logs(data.email);
      res.status(200).json({ success: true, data: data.email });
      //sendRep(err,data,req,res);
   });
};

//Camera functions
exports.cameraMap = (req, res) => {
   const cameraMap = new Camera({
      cameraID: req.body.cameraID,
      cameraUrl: req.body.cameraURL,
      bedNumber: req.body.bedNumber,
      roomNumber: req.body.roomNumber,
      patientID: req.body.patientID
   });
   cameraMap.save((err, data) => sendRep(err, data, req, res));
};

function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
}

exports.cameraUpdate = (req, res) => {
   Camera.findOneAndUpdate(
      req.params.cameraID,
      { $set: req.body },
      (err, data) => sendRep(err, data, req, res)
   );
};
exports.cameraGet = (req, res) => {
   Camera.find({ cameraID: req.body.cameraID }, (err, data) =>
      sendRep(err, data, req, res)
   );
};
exports.cameraGetAll = (req, res) => {
   Camera.find({}, (err, data) => sendRep(err, data, req, res));
};

exports.cameraRemove = (req, res) => {
   Camera.remove({ cameraID: req.body.cameraID }, (err, data) =>
      sendRep(err, data, req, res)
   );
};

exports.sendSms = (req, res) => {
   var url = "http://api.msg91.com/api/sendhttp.php";

   logs("Message sent to: " + req.body.mobiles);
   //return res.redirect('/login');
   axios
      .get(url, {
         params: {
            country: 91,
            sender: "DBLHLX",
            route: 4,
            mobiles: "91" + req.body.mobiles,
            authkey: creds.api,
            message: req.body.message
         }
      })
      .then(function (response) {
         console.log(response);
         res.status(200).json({ success: true });
      })
      .catch(function (error) {
         console.log(error);
      });
};

exports.changeStream = (req, res) => {
   var cameraID = req.query.cameraID;
   //var patientID = req.params.patientID;
   var status = req.query.status;
   console.log(cameraID);
   if (status == "enable") {
      Camera.findOneAndUpdate(
         { cameraID: req.query.cameraID },
         { $set: { status: "enabled" } },
         (err, data) => {
            logs("Camera " + cameraID + " enabled");
            // sendRep(err, data, req, res);
            writeFM2();
         }
      );
   } else {
      Camera.findOneAndUpdate(
         { cameraID: req.query.cameraID },
         { $set: { status: "disabled" } },
         (err, data) => {
            logs("Camera " + cameraID + " disabled");
            // sendRep(err, data, req, res);
            writeFM2();
         }
      );
   }

   res.redirect("/AdminDashboard/patients");
};

function writeFM2() {
   var data = "";
   Camera.find((err2, data2) => {
      var cams = [];
      for (i in data2) {
         if (i == 0);
         else {
            data += "\n";
         }
         var id = data2[i].cameraID;
         data +=
            "camstream" +
            id +
            "," +
            data2[i].cameraUrl +
            ",streamcam" +
            id +
            "," +
            data2[i].status;
      }
      logs(data2);
      fs.writeFile("web/views/video/INPUT", data, function (err, data) {
         if (err) console.log(err);
         console.log("Successfully Written to File.");
      });
   });
}

//Misc functions
function sendRep(err, data, req, res) {
   if (err) {
      res.status(500).json({ err: err });
      console.log("[] Error logging in: " + err);
   } else {
      //res.redirect('/index');
      res.status(200).json(data);
   }
}

function checkLogin(req, res) {
   if (req.session && req.session.userId) {
   } else {
      return res.redirect("Login");
   }
}

function logs(data) {
   console.log("[]: " + data);
}
