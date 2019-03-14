const express = require("express");
const path = require("path");
const User_controller = require("../controllers/Users_controllers");
const Stream_controller = require("../controllers/Stream_controller");
const Admin_controller = require("../controllers/Admin_controller");
const Patient_controller = require("../controllers/Patient_controller");
const Api_controller = require("../controllers/api");
var os = require("os-utils");
const Camera = require("../models/Camera");
const Patients = require("../models/Patient");

const shell = require("shelljs");

const authError = (err, req, res, next) => {
  return res.status(401).json({ success: false, message: "unauthorized" });
  //return res.redirect('/login.html');
};

module.exports = app => {
  const Users = express.Router();
  const Stream = express.Router();
  const Admin = express.Router();
  const Patient = express.Router();
  const Api = express.Router();

  ///Login page
  app.all("/", (req, res) => {
    res.render("login");
  });
  app.all("/Login", (req, res) => {
    res.render("login");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.get("/AdminDashboard", (req, res) => {
    res.render("AdminDashboard/index");
  });
  app.get("/AdminDashboard/index", (req, res) => {
    res.render("AdminDashboard/index");
  });
  app.get("/AdminDashboard/contact", (req, res) => {
    res.render("AdminDashboard/contact");
  });
  app.get("/AdminDashboard/addPatients", (req, res) => {
    res.render("AdminDashboard/addPatients", { Success: null });
  });
  app.get("/AdminDashboard/cameras", (req, res) => {
    Camera.find((err, data) =>
      res.render("AdminDashboard/cameras", { cameras: data })
    );
  });
  app.get("/AdminDashboard/patients", (req, res) => {
    Camera.find((err, data) => {
      var cams = [];
      cams[0] = "";
      for (i in data) {
        cams[data[i].cameraID] = data[i].status;
      }
      Patients.find((err2, data2) =>
        res.render("AdminDashboard/patients", { patients: data2, camera: cams })
      );
    });
  });

  app.get("/AdminDashboard/changeStream", Admin_controller.changeStream);

  app.get("/Test", Patient_controller.test3);

  app.use("/AdminDashboard", Patient);
  Patient.post("/newPatient", Patient_controller.newPatient);
  Patient.post("/newRelative", Patient_controller.newRelative);
  Patient.post("/updateMinutes", Patient_controller.updateMinutes);
  Patient.post("/modifyPatient", Patient_controller.modifyPatient);
  Patient.post("/removeRelative", Patient_controller.removeRelative);
  Patient.post("/removeRelativeAll", Patient_controller.removeRelativeAll);
  Patient.post("/patientGet", Patient_controller.removeRelative);
  Patient.post("/patientGetAll", Patient_controller.PatientGetAll);
  Patient.get("/removePatient", Patient_controller.removePatient);

  app.get("/PatientDashboard", (req, res) => {
    res.render("PatientDashboard/index");
  });
  app.get("/PatientDashboard/index", (req, res) => {
    res.render("PatientDashboard/index");
  });
  app.get("/PatientDashboard/documents", (req, res) => {
    res.render("PatientDashboard/documents");
  });
  app.get("/PatientDashboard/bestWishes", (req, res) => {
    res.render("PatientDashboard/bestWishes");
  });
  app.get("/PatientDashboard/payment", (req, res) => {
    res.render("PatientDashboard/payment");
  });
  app.get("/PatientDashboard/pricing", (req, res) => {
    res.render("PatientDashboard/pricing");
  });

  app.get("/ICUDashboard/", (req, res) => {
    res.render("ICUDashboard/patients");
  });

  app.get("/ICUDashboard/", (req, res) => {
    res.render("ICUDashboard/patients");
  });

  app.get("/ICUDashboard/patients", (req, res) => {
    res.render("ICUDashboard/patients");
  });

  app.get("/ICUDashboard/stream", (req, res) => {
    res.render("ICUDashboard/stream");
  });

  app.get("/ICUDashboard/profile", (req, res) => {
    res.render("ICUDashboard/profile");
  });

  app.get("/ICUDashboard/calender", (req, res) => {
    res.render("ICUDashboard/calender");
  });


  app.all("/SMS", Admin_controller.sendSms);

  app.post("/api/login", Api_controller.login);
  app.post("/api/login2", Api_controller.login2);

  //Users login page
  app.use("/Users", Users);
  Users.post("/Register", User_controller.create);
  Users.post("/Login", User_controller.authenticate);
  //Users.all('/Logout', User_controller.logout);

  app.all("/Logout", User_controller.logout);

  ///Stream page
  app.use("/Stream", Stream);
  Stream.get("/Main", Stream_controller.stream);
  Stream.get("/Test", Stream_controller.test);

  app.use("/index", requiresLogin, Admin_controller.main, authError);

  ///Admin page
  app.use("/Admin", Admin);
  Admin.post("/Test", Admin_controller.direct);
  Admin.post("/CamMap", Admin_controller.cameraMap);
  Admin.post("/CamUpdate", Admin_controller.cameraUpdate);
  Admin.post("/CamGet", Admin_controller.cameraGet);
  Admin.post("/CamGetAll", Admin_controller.cameraGetAll);
  Admin.post("/CamRemove", Admin_controller.cameraRemove);
  Admin.get("/TestStream", Admin_controller.test);


  app.use("/stopStream", (req,res) => {
    shell.exec('mv ../views/video/playlist/playlist.m3u8 ../views/video/playlist/playlist2.m3u8'),
    res.redirect("/ICUDashboard/stream");;
    //jwplayer().stop()
  });
app.use("/startStream", (req,res) => {
  shell.exec('mv ../views/video/playlist/playlist2.m3u8 ../views/video/playlist/playlist.m3u8'),
  res.redirect("/ICUDashboard/stream");
  //Patient
});

  //Error page
  app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
  });
};

function requiresLogin(err, req, res, next) {
  console.log("test2");
  if (req.session && req.session.userId) {
    console.log("test");
    return next();
  } else {
    console.log("error");
    return next(err);
  }
}
function sendRep(err, data, req, res) {
  if (err) {
    res.status(500).json({ err: err });
    console.log("[] Error logging in: " + err);
  } else {
    //res.redirect('/index');
    res.status(200).json(data);
  }
}

function logs(data) {
  console.log("[] " + data);
}
