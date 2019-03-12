var app = require('express')();
var http = require('http').Server(app);
var socketIO = require('socket.io');
var port = 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(port, function(){
    console.log('listening on *: '+port);
  });

var io = socketIO.listen(server)
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', (msg)=>{
      console.log('Message : '+msg);
  })

});

