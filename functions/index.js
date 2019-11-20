const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
admin.initializeApp();
const database = admin.database().ref("/items");
const patientDB = admin.database().ref("/patients");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

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
