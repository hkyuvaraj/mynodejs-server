var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var homeautomation = [
    {
        "id": "1",
        "text": "Default",
        "Status" : false
    }
];


app.get('/homeautomation', function(req, res) {
    console.log("GET From SERVER");
    res.send(homeautomation);
});

app.post('/homeautomation', function(req, res) {
    var requestbody = req.body;
    console.log(req.body);
    
    homeautomation = []
    homeautomation.push(requestbody);
    res.status(200).send("Successfully posted requestbody");
});

app.listen(8080);
