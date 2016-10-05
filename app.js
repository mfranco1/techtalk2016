var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ipaddress = '';
require('dns').lookup(require('os').hostname(), function(err, addr, fam){
  console.log('ip address local: ' + addr);
  ipaddress = addr;
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('User has connected');
  io.emit('stream_data', 'A user has connected');

  socket.on('new_filter', function(phrase){
    console.log('filter keyword: ' + phrase);
    io.emit('stream_data', 'filter keyword: ' + phrase);
  });
});

http.listen(3000, ipaddress, function(){
  console.log('listening on socket:3000');
});
