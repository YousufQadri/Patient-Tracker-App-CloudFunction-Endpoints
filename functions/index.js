const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
admin.initializeApp();
const database = admin.database().ref("/items");
const patientDB = admin.database().ref("/patients");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.addPatient = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    let {
      patientName,
      age,
      disease,
      medications,
      description,
      date,
      doctorId
    } = req.body;
    if (
      !patientName ||
      !age ||
      !disease ||
      !medications ||
      !description ||
      !date ||
      !doctorId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }
    try {
      const patient = {
        patientName,
        age,
        medicalHistory: [{ disease, medications, description, date }],
        doctorId
      };
      // let patientExists = false;
      // patientDB.once("value", snapshot => {
      //   snapshot.forEach(snap => {
      //     if (snap.val().patientName === patientName) {
      //       console.log("data", snap.val().patientName);
      //       patientExists = true;
      //     }
      //     return patientExists;
      //   });
      // });
      // console.log("patient exists?", patientExists);

      // if (patientExists) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Patient already exists!"
      //   });
      // }

      //   console.log("patient:", patient);
      patientDB.push(patient);
      res.status(200).json({
        message: "Patient added successfully",
        patient
      });
    } catch (err) {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    }

    // let items = [];
    // return database.on(
    //   "value",
    //   snapshot => {
    //     snapshot.forEach(item => {
    //       items.push({
    //         id: item.key,
    //         items: item.val().item
    //       });
    //     });
    //     res.status(200).json(items);
    //   },
    //   error => {
    //     res.status(error.code).json({
    //       message: `Something went wrong. ${error.message}`
    //     });
    //   }
    // );
  });
});

exports.getPatients = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }

    let patients = [];

    const doctorId = req.query.id;
    console.log("doctor id:", doctorId);

    return patientDB.on(
      "value",
      snapshot => {
        snapshot.forEach(patient => {
          console.log("p", patient.val());
          if (patient.val().doctorId === doctorId) {
            patients.push({
              id: patient.key,
              age: patient.val().age,
              doctorId: patient.val().doctorId,
              medicalHistory: patient.val().medicalHistory,
              patientName: patient.val().patientName
            });
          }
        });

        res.status(200).json(patients);
      },
      error => {
        res.status(error.code).json({
          message: `Something went wrong. ${error.message}`
        });
      }
    );
  });
});

exports.signUp = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    console.log("req body:", req.body);
    const doctor = req.body;
    doctorDB.push({ doctor });
    let doctors = [];
    return database.on(
      "value",
      snapshot => {
        snapshot.forEach(doctor => {
          doctors.push({
            id: doctor.key,
            doctors: doctor.val()
          });
          console.log(doctor.doctorName);
        });

        res.status(200).json(doctors);
      },
      error => {
        res.status(error.code).json({
          message: `Something went wrong. ${error.message}`
        });
      }
    );
  });
});
