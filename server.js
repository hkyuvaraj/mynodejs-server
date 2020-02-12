var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nodemailer = require('nodemailer');


//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

app.post('/sendMail', function(req, res) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'krishnan.halaiah@gmail.com',
        pass: 'reena@jan07'
    }
});

  var data = req.body;
  var mailOptions = {
    from: 'krishnan.halaiah@gmail.com',
    to: 'h.k.yuvaraj@gmail.com',
    subject: 'Email sent by nodemailer',
    text: data
  };

  transporter.sendMail(mailOptions, function(error, info) {
    console.log('Data:' + data);
     if (error) {
      return res.status(500).send(error);
      }  
    else{
      return res.status(201).send("Successfully sent email:"+ info);
    }
  });
  
});


app.listen(process.env.PORT || 8080);
