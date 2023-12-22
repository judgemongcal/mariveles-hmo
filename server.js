const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect("mongodb://127.0.0.1:27017/mho_db", { useNewUrlParser: true, useUnifiedTopology: true });
 

const appointmentSchema = {
    fname: String, 
    lname: String, 
    email: String, 
    phoneNum: String,
    appointmentType: String,
    date: Date,
    time: String
}

const PatientAppointment = mongoose.model('patient_appointments', appointmentSchema);

app.get("/", function(req, res) {
    console.log('Received Get Method');
    res.sendFile(path.join(__dirname, 'forms_final.html'));
});

app.get("/goToHomePage", function(req, res) {
    console.log('Redirecting to Home Page');
    res.sendFile(path.join(__dirname, 'index_files', 'index.html'));
});


app.post("/", async function(req, res) {
    console.log("Received Post Method");

    const { date, time, ...otherData } = req.body;

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    let newAppointment = new PatientAppointment({ ...otherData, date: nextDay, time });

    try {
        const savedAppointment = await newAppointment.save();
        console.log("Appointment saved to MongoDB:", savedAppointment);

        res.status(200).json({ message: "Appointment saved successfully" });

    } catch (err) {
        console.error("Error saving appointment to MongoDB:", err);
        res.status(500).send("Error saving appointment to MongoDB");
    }
});

app.get("/getAppointments", async function(req, res) {
  try {
      const appointments = await PatientAppointment.find();
      res.status(200).json(appointments);
  } catch (err) {
      console.error("Error retrieving appointments from MongoDB:", err);
      res.status(500).send("Error retrieving appointments from MongoDB");
  }
});


app.listen(3000, function() {
    console.log("server is running on 3000");
})