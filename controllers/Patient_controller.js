const User = require("../models/User");
const Patient = require("../models/Patient");
const creds = require("../creds");
const axios = require("axios");
const bcrypt = require("bcrypt");
const generator = require("generate-password");

exports.changeStream = (req, res) => {};

exports.newRelative = (req, res) => {
  var username = req.body.patientID;
  var phone = req.body.phone;

  var password = generator.generate({
    length: 6,
    uppercase: false
  });
  var hashedPassword = "";
  bcrypt.hash(password, 2, function(err, hash) {
    if (err) {
      console.log(err);
    }
    var finalUser = username + "@" + parseInt(phone).toString(36);

    const Relative = {
      name: req.body.name,
      phone: req.body.phone,
      password: hash
    };
    Patient.findOneAndUpdate(
      { patientID: req.body.patientID },
      { $push: { relativesList: Relative } },
      { new: true },
      (err, data) => sendRep(err, data, req, res)
    );
  });
};

exports.updateMinutes = (req, res) => {
  Patient.findOneAndUpdate(
    req.body.PatientID,
    { $set: req.body },
    (err, data) => sendRep(err, data, req, res)
  );
};

exports.modifyPatient = (req, res) => {
  Patient.findOneAndUpdate(
    req.body.patientID,
    { $set: req.body },
    (err, data) => sendRep(err, data, req, res)
  );
};

exports.removeRelative = (req, res) => {
  Patient.findOneAndUpdate(
    req.body.patientID,
    { $pull: { relativesList: { name: req.body.name } } },
    { new: true },
    (err, data) => sendRep(err, data, req, res)
  );
};

exports.removePatient = (req, res) => {
  Patient.deleteOne({ _id: req.query.patientID }, (err, data) =>
    res.redirect("../AdminDashboard/patients")
  );
};

exports.removeRelativeAll = (req, res) => {
  Patient.findOneAndUpdate(
    req.body.patientID,
    { $pull: { relativesList: {} } },
    { new: true },
    (err, data) => sendRep(err, data, req, res)
  );
};

exports.PatientGet = (req, res) => {
  Patient.find({ patientID: req.body.patientID }, (err, data) =>
    sendRep(err, data, req, res)
  );
};

exports.PatientGetAll = (req, res) => {
  Patient.find({}, (err, data) => sendRep(err, data, req, res));
};

//Patients functions 9738267219
exports.newPatient = (req, res) => {
  var relPusher = req.body.relatives;
  console.log(relPusher[0]);
  //console.log("---\n" + req.body.relatives);
  var patientID = req.body.patientID;
  patientID = patientID.replace(" ", "").toLowerCase();

  var finalUser =
    patientID + "@" + parseInt(req.body.mainPhone + ".0").toString(36);
  var passar = ["alpha", "bethya", "gahsus", "koalas"];
  var passwords = generator.generate({
    length: 6,
    uppercase: false
  });

  // var passwords = passar[Math.floor(Math.random() * 3 + 0)];
  console.log(passwords);
  bcrypt.hash(passwords, 10, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      const patientMap = new Patient({
        name: req.body.name,
        room: req.body.room,
        mainPassword: hash,
        patientID: patientID,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        bed: req.body.bed,
        mainPhone: req.body.mainPhone,
        mainName: req.body.mainName,
        cameraID: 1
      });

      patientMap.save((err, data) => {
        console.log(finalUser + " , " + passwords);
        sendToPage2(
          patientID,
          err,
          data,
          req,
          res,
          "AdminDashboard/addPatients"
        );
      });

      sendSms(req.body.mainPhone, finalUser, passwords);
    }
  });
};
function addRelative(patientID, relatives, req) {
  console.log(patientID + relatives);
  var relPusher = relatives;
  var rpassword = generator.generate({
    length: 6,
    uppercase: false
  });
  var rotp = Math.floor(Math.random() * 99999 + 9999);
  var rphone = relatives.phone;
  var finalPush = "";
  var finalUser = patientID + "@" + parseInt(rphone + ".0").toString(36);

  console.log(relPusher.name + " , " + finalUser + " , " + rpassword + "\n");

  bcrypt.hash(rpassword, 5, function(err, hash2) {
    relPusher.password = hash2;
    relPusher.otp = rotp;

    Patient.findOneAndUpdate(
      { patientID: patientID },
      { $push: { relatives: relPusher } },
      { new: true },
      (err, data) => {
        if (err) console.log(err);
        else {
          sendSms(relPusher.phone, finalUser, rpassword);
          sendSmsOTP(
            req.body.mainPhone,
            relPusher.phone,
            relPusher.name,
            rotp,
            patientID
          );
        }
      }
    );
  });
}
exports.test3 = (req, res) => {
  sendSmsOTP("9108287991", "9449084477", "Shravan", "1098", "165");
};
exports.validateMain = (req, res) => {
  var patientID = req.body.patientID;
  Patient.find({ patientID: req.body.patientID }, (err, data) => {});
};

//Misc functions
function sendRep(err, data, req, res) {
  if (err) {
    res.status(500).json({ err: err });
    console.log("[] Error logging in: " + err);
  } else {
    res.status(200).json(data);
  }
}

function sendToPage(err, data, req, res, redirect) {
  if (err) {
    console.log("[] Error logging in: " + err);
    res.render(redirect, { Success: false });
  } else {
    res.render(redirect, { Success: true });
  }
}

function sendToPage2(patientID, err, data, req, res, redirect) {
  if (err) {
    console.log("[] Error logging in: " + err);
    res.render(redirect, { Success: false });
  } else {
    var relPusher = req.body.relatives;
    console.log(relPusher[0]);

    for (i in relPusher) {
      console.log("[REL]: " + relPusher[i]);
      addRelative(patientID, relPusher[i], req);
    }

    res.render(redirect, { Success: true });
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

function logs2(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("[]: " + data);
  }
}

function sendSms(mobile, user, password) {
  var url = "http://api.msg91.com/api/sendhttp.php";
  logs("Message sent to: " + mobile);
  var message =
    "You have been registered for Streaming Facility at Apollo Hospitals\nUsername:" +
    user +
    "\nPassword:" +
    password;
  //return res.redirect('/login');
  axios
    .get(url, {
      params: {
        country: 91,
        sender: "DBLHLX",
        route: 4,
        mobiles: "91" + mobile,
        authkey: creds.api,
        message: message
      }
    })
    .then(function(response) {
      //console.log(response);
      logs("Message sent successfully");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function sendSmsOTP(mobile, fromMobile, from, otp, patientID) {
  message =
    "Your assoicate " +
    from +
    " wants to view the stream with mobile no " +
    fromMobile +
    "\nTo allow access, please ask them to enter the\nOTP: " +
    otp;

  var url = "http://api.msg91.com/api/sendhttp.php";

  logs("Message sent to: " + mobile);

  axios
    .get(url, {
      params: {
        country: 91,
        sender: "DBLHLX",
        route: 4,
        mobiles: "91" + mobile,
        authkey: creds.api,
        message: message
      }
    })
    .then(function(response) {
      logs("Message sent successfully");
    })
    .catch(function(error) {
      console.log(error);
    });
}
