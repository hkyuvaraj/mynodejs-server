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
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(__dirname + '/public'));  
app.use(express.static(__dirname + '/public')); 


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



app.post('/receive', function(request, respond) {
    var body = '';
    filePath = __dirname + '/public/data.txt';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
         return respond.status(201).send("Successfully saved file @:"+ filePath);
         //respond.end();
        });
    });
});

app.get('/download', function(req, res){
  const file = `${__dirname}/public/data.txt`;
  
  res.setHeader('Content-disposition', 'attachment; filename=data.txt');
  res.setHeader('Content-type', 'text/plain');
  res.download('/app/public/data.txt'); // Set disposition and send it.
});

const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), createFolder);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}



function createFolder(auth) {
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
  'name': 'Heroku',
  'mimeType': 'application/vnd.google-apps.folder'
};
drive.files.create({
  resource: fileMetadata,
  fields: 'id'
}, function (err, file) {
  if (err) {
    // Handle error
    console.error(err);
  } else {
    console.log('Folder Id: ', file.id);
  }
});
  
}




app.listen(process.env.PORT || 8080);
