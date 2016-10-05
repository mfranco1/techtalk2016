var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');
var config = require('./config.js');

var ipaddress = '';
require('dns').lookup(require('os').hostname(), function(err, addr, fam){
  console.log('ip address local: ' + addr);
  ipaddress = addr;
});

var client = new Twitter({
  consumer_key: config.twitter.CONSUMER_KEY,
  consumer_secret: config.twitter.CONSUMER_SECRET,
  access_token_key: config.twitter.ACCESS_TOKEN_KEY,
  access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('User has connected');
  socket.on('new_filter', function(phrase){
    console.log('filter keyword: ' + phrase);
    var stream = client.stream('statuses/filter', {track: phrase});

    stream.on('data', function(event){
      console.log(event && event.text);
      io.emit('stream_data', event && event.text);
    });

    stream.on('error', function(err){
      throw err;
    });
  });
});

http.listen(3000, ipaddress, function(){
  console.log('listening on socket:3000');
});
