var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nodemailer = require('nodemailer');
var fs = require('fs');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use('/public', express.static(__dirname + '/public'));  
//app.use(express.static(__dirname + '/public')); 


var homeautomation = { "appliances" : [
    {
        "id": "1",
        "text": "Default",
        "Status" : "ON"
    },
    {
        "id": "2",
        "text": "Default",
        "Status" : "OFF"
    },
   {
        "id": "3",
        "text": "Default",
        "Status" : "OFF"
    },
   {
        "id": "4",
        "text": "Default",
        "Status" : "OFF"
    }
  
]};


app.get('/homeautomation', function(req, res) {
    console.log("GET From SERVER");
    res.send(homeautomation);
});

app.post('/homeautomation', function(req, res) {
    var requestbody = req.body;
    console.log(req.body);
    
    //homeautomation = []
    //homeautomation.push(requestbody);
    homeautomation = requestbody
  
    res.status(201).send("Successfully posted requestbody");
});





app.listen(process.env.PORT || 8080);
