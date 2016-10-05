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

http.listen(3000, ipaddress, function(){
  console.log('listening on socket:3000');
});
