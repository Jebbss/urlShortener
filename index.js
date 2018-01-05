var express = require('express');
var mongo = require('mongodb');
var path = require('path');

var app = express();

// Regex from https://gist.github.com/dperini/729294
var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

var urlDB = process.env.MONGOLAB_RED_URI || 'mongodb://localhost:27017/data';
var appUrl = "https://jeb-urlshortner.herokuapp.com/";
var dbName = "heroku_z9v40256";
//connect to db
mongo.MongoClient.connect(urlDB, function (err, client) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error: ', err);
  } else {
    console.log('Connection established to ', urlDB);
  }
  var db = client.db(dbName);
  var port = process.env.PORT || 3500;

  app.listen(port, function(){
    console.log("Listening on port: " + port);
  });

  // serves landing page directions
  app.get('/', function(req, res) {
    var file = path.join(__dirname, 'index.html');
    res.sendFile(file, function (err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
    });
  });

  //create short url
  app.get('/new/:url*', function (req, res) {
    var url = req.url.slice(5);
    var id = Math.floor(Math.random() * 10000);
    var retObj = {};
    if (regex.test(url)) {
      retObj = {  "original_url":url ,
                  "short_url":appUrl + id,
                  "id":id
                };
      db.collection("data").insert(retObj, function(err, data) {
        if (err) {console.log("Insert db err: " + err);}
      });
    }
    else {
      retObj = {"errCode": "Invalid url"}
    }

    res.json(retObj);
  });

  //search db by id
  app.get('/:key', function (req, res) {
    var key = parseInt(req.params.key);
    db.collection("data").find({"id": key}).toArray(function(err, docs) {
      console.log("Found the following records");
      console.log(docs)
      if (Object.keys(docs).length > 0) {
        res.redirect(docs[0].original_url);
      }
      else {
        res.send("oops")
      }
    });
  });

});
