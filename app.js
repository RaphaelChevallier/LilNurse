const http = require('http');
const port=process.env.PORT || 1337
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Hello World</h1>');
});

//var app = http.createServer((req, res) =>{
//    res.send(JSON.stringify({ 'msg': 'Hello Stefanw' }));
//});
var express = require('express');
var tediousExpress = require('express4-tedious')

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

// server.listen(port,() => {
// console.log(`Server running at port `+port);
// });

// var Connection = require('tedious').Connection;
// var Request = require('tedious').Request;
//
// // Create connection to database
// var config =
// {
//     userName: 'LilNurse', // update me
//     password: 'Marpole1', // update me
//     server: 'marpole1.database.windows.net', // update me
//     options:
//     {
//         database: 'Patient-Doctor', //update me
//         encrypt: true
//     }
// }
// var connection = new Connection(config);
//
// // Attempt to connect and execute queries if connection goes through
// connection.on('connect', function(err)
//     {
//         if (err)
//         {
//             console.log(err)
//         }
//         else
//         {
//             queryDatabase()
//         }
//     }
// );
//
// function queryDatabase()
// {
//     console.log('Reading rows from the Table...');
//
//     // Read all rows from table
//     var request = new Request(
//         "SELECT pname, medName, dosage, specialInstructions from Medication.pno;",
//         function(err, rowCount, rows)
//         {
//             console.log(rowCount + ' row(s) returned');
//             process.exit();
//         }
//     );
//
//     request.on('row', function(columns) {
//         columns.forEach(function(column) {
//             console.log("%s\t%s", column.metadata.colName, column.value);
//         });
//     });
//     connection.execSql(request);
// }
