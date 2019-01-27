const http = require('http');
const port=process.env.PORT || 1337
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Hello World</h1>');
});

var express = require('express');
var tediousExpress = require('express4-tedious')

//connection
var app = express();
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

    req.sql("select * from Medication where pno = " + id +" for json path")
    .into(res);
});
