var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "parallel",
  port: "3306",
  dateStrings: true
});

connection.connect();


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// add group from database to groups variable
groups = ['g1', 'g2']

io.on('connection', function (socket) {
  var name;
  var author = false;
  socket.on('login', function (user) {
    //TODO: check user,password with data base
    name = user.name;
    author = true;
    console.log('user: ' + name + ' has disconnected.');
    socket.emit('group list', groups);
  });
  socket.on('create group', function (group) {
    if (author) {
      console.log(group)
      if (groups.indexOf(group) < 0) {
        // if group not in groups
        groups.push(group)
        io.emit('new group', group)
        console.log('user : ' + name + ' create new group ,' + group)
        // TODO: save to data base
      }

    }
  });
  socket.on('join group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        socket.join(group)
        console.log('user : ' + name + ' join group ,' + group)
        // TODO: save to data base
      }

    }
  });
  socket.on('leave group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        socket.leave(group)
        console.log('user : ' + name + ' leave group ,' + group)
      }
      // TODO: save to data base
    }
  });
  socket.on('exit group', function (group) {
    // TODO: save to data base
    // send timestamp to database
    //console.log(currentTimestamp);
    try{
      let result = await query('SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?; \
      SELECT join_group.join_group_id FROM join_group JOIN chat_group WHERE join_group.join_group_id = chat_group.group_id AND chat_group.group_name=?; \
      UPDATE join_group SET is_exist=0,latest_time_read=current_timestamp() WHERE join_user_id=? AND join_group_id=?;', [group.user_name, group.group_name, group.user_id, group.group_id]);
  
      console.log('exit group')
    } catch(e){
      console.log(e);
    }

  });
  socket.on('unexit group', function (group) {
    // TODO: save to data base
    // username = 'MisterA';
    // msg = 'test2'; //Get all unread message from database (with username, timestamp)
    // chatTimestamp = 0; //Test only, don't forget to change to latest read chat timstamp
    try{
      let result = await query('SELECT chat_user.user_name,chat_log.time_sent,chat_log.message \
      FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id \
      WHERE chat_log.time_sent >= (SELECT latest_time_read \
      FROM join_group \
      WHERE join_user_id=? AND join_group_id=?);', [group.user_id, group.group_id]);
  
      // socket.emit('unexit group', [{ 'username': username, 'message': msg, 'timestamp': chatTimestamp }]);
      socket.emit('unexit group', result);
    } catch(e){
      console.log(e);
    }
    
  })
  socket.on('chat message', function (msg) {
    if (author) {
      console.log('message from ' + name + ' : ' + msg.text + '  -- (' + msg.group + ')');
      //TODO: check with database if user join msg.group 
      io.to(msg.group).emit('chat message', name + ' : ' + msg.text);
      //TODO: save message to data base
      //TODO: update last message time to database
    }
  });
  socket.on('disconnect', function (msg) {
    author = false
    console.log('user: ' + name + ' has disconnected.');
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

function query(sql, params) {
  connection.query(
    sql, params, (error, result) => {
      if (error) rej(error);

      //let all = JSON.parse(JSON.stringify(result));
      // console.log(result);
    }
  );
}