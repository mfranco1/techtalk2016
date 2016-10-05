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
  io.emit('stream_data', 'A user has connected');

  socket.on('new_filter', function(phrase){
    console.log('filter keyword: ' + phrase);
    client.post('statuses/update', {status: 'testing twitter API: ' + phrase}, function(err, tweet, res){
      if(err) throw err;
      console.log(tweet);
    });
  });
});

http.listen(3000, ipaddress, function(){
  console.log('listening on socket:3000');
});
