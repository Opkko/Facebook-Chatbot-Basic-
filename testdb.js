let mongoose = require('mongoose');

mongoose.connect('mongodb://testbot:1313opkko@ds033123.mlab.com:33123/testbot');

var database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log('connected')
});


//var mongoose = require('mongodb').mongoose
  //let assert = require('assert');

// Connection URL
//var url = 'mongodb://testbot:1313opkko@ds033123.mlab.com:33123/testbot';

// Use connect method to connect to the server
//mongoose.connect(url, function(err, db) {
  //assert.equal(null, err);
  //console.log("Connected successfully to server");

  //db.close();
//});