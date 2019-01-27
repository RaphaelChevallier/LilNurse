const http = require('http');
const port=process.env.PORT || 1337
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Hello World</h1>');
});

var express = require('express');
const bodyParser = require("body-parser");
var tediousExpress = require('express4-tedious')
const logger = require('morgan');

//connection
var app = express();
app.use(express.urlencoded());
app.use(logger('dev'));

var connectionObj = {
    "server"  : "marpole1.database.windows.net",
    "userName": "LilNurse",
    "password": "Marpole1",
    "options": { "encrypt": true, "database": "Patient-Doctor" }
}
app.use(function (req, res, next) {
    req.sql = tediousExpress(connectionObj);
    next();
});

app.get('/', (req, res) => {
  // res.send(JSON.stringify({ 'msg': 'Hello Stefan' }));
  res.json({ msg : "Hello Stefan"})
});
app.listen(port, () => console.log(`Listening on port: ${port}`))

app.get('/patientList', function (req, res) {

    req.sql("select * from Patient for json path")
    .into(res);
});

app.get('/Medication', function (req, res) {

    req.sql("select * from Medication for json path")
    .into(res);
});

app.get('/findUser', function (req, res) {

  var id = req.query.user

    req.sql("select medName, dosage, quantity, specialInstructions from Medication where pno = " + id +" for json path")
    .into(res);
});

app.post('/register', function (req, res) {
  console.log("hit the /register endpoing");
  //console.log("req: ", req);

    let { patient_name, hospital_name, doc_name, pno, patient_subscribing, medName, dose, quantity, date_issued, special_Ins } = req.body;

    console.log("patient_name: ", patient_name);

    // var patientName = req.body.patient_name || "";
    // var hospital = req.body.hospital_name || "";
    // var doctor = req.body.doc_name || "";
    // var pno = req.body.pno || "";
    // var subscribed = req.body.patient_suscribing || "";
    // var med = req.body.medName || "";
    // var dosage = req.body.dose || "";
    // var quantity = req.body.quantity || "";
    // var date = req.body.date_issued || "";
    // var special = req.body.special_Ins || "";

    // const Patient = {
    //     pno, patient_name, hospital, doctor
    // }
    //
    // const Medication = {
    //   med, dosage, pno, special, quantity, date
    // }

    console.log(medName);

    if(patient_subscribing === 'website'){
        console.log("yes, we're subscribed to website. Do the thing...");

        var sqlstatement = "Insert into Patient (pno, pname, hospital, docName) values(" + pno + ", '" + patient_name + "', '" + hospital_name + "', '" + doc_name + "')";

        console.log(sqlstatement);

        req.sql("Insert into Patient (pno, pname, hospital, docName) values(" + pno + ", '" + patient_name + "', '" + hospital_name + "', '" + doc_name + "')");

        req.sql("Insert into Medication (medName, dosage, Papno, specialInstructions, quantity, dateIssued, typeOfMedicine) values('" + medName + "', '" + dose + "', " + pno + ", '" + special_Ins + "', '" + quantity + "', '" + date_issued + "', 'bottle')").into(res)





        //res.send(200);
    }
    else {
      res.send(500);
    }
  });
