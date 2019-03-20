var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var mysql = require("mysql");

config = require('./config.js');
var connection = mysql.createConnection({
  host: "localhost",
  user: config.database.user,
  password: config.database.password,
  database: "parallel",
  port: "3306",
  dateStrings: true
});

// connection.connect();


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

groups = ['g1', 'g2']

connection.query('SELECT group_name FROM chat_group;',function(err,row){
  for(i=0;i<row.length;i++){
    groups.push(row[i].group_name)
  }
})

io.on('connection', function (socket) {
  var name;
  var author = false;
  socket.on('login', function (user) {
    connection.query('SELECT * FROM chat_user WHERE user_name = ?;',[user.name],function(err,row){
      console.log(row)
      if(row.length == 1){
        name = user.name;
        console.log('user: ' + name + ' has connected.');
        socket.emit('group list', groups);
        author = true;
      }
    })
  });
  socket.on('create group', function (group) {
    if (author) {
      if (groups.indexOf(group) < 0) {
        // if group not in groups
        connection.query('INSERT INTO chat_group(group_name) VALUES(?);', [group], function(err,row){
          groups.push(group)
          io.emit('new group', group)
          console.log('user : ' + name + ' create new group ,' + group)
        });
      }

    }
  });
  socket.on('join group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        connection.query('select * from join_group,chat_group,chat_user where join_user_id = user_id and group_id = join_group_id and group_name = ? and user_name = ?;',[group,name],function(err,row){
          if(row.length === 0){
            connection.query('INSERT INTO join_group(join_user_id,join_group_id,is_exist,latest_time_read) VALUES ((SELECT user_id from chat_user where user_name = ?),(SELECT group_id from chat_group where group_name = ?),1,current_timestamp());',[name, group],function(err,row){
              socket.join(group)
              console.log('user : ' + name + ' join group ,' + group)  
            })    
          }
          else{
            console.log('alredy join')
          }
        })
        
      }

    }
  });
  socket.on('leave group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        connection.query('select * from join_group,chat_group,chat_user where join_user_id = user_id and group_id = join_group_id and group_name = ? and user_name = ?;',[group,name],function(err,row){
          if(row.length === 0){
            console.log('not alredy join')  
          }
          else{
            connection.query('DELETE FROM join_group WHERE join_user_id=(SELECT user_id from chat_user where user_name = ?) AND join_group_id=(SELECT group_id from chat_group where group_name = ?);',[name, group],function(err,row){
              socket.leave(group)
              console.log('user : ' + name + ' leave group ,' + group)  
            })
          }
        })
      }
    }
  });
  socket.on('exit group', function (group) {
    try{
      let result = query('SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?;\
      SELECT join_group.join_group_id FROM join_group JOIN chat_group WHERE join_group.join_group_id = chat_group.group_id AND chat_group.group_name=?;\
      UPDATE join_group SET is_exist=0,latest_time_read=current_timestamp() WHERE join_user_id=? AND join_group_id=?;', [group.user_name, group.group_name, parseInt(group.user_id), group.group_id], 'exit group list', 1);
      console.log(group)
      console.log('user : ' + group.user_name + ' exit group')
      // console.log(group)
    } catch(e){
      console.log(e);
    }

  });
  socket.on('unexit group', function (group) {
    // console.log(group.group_id)
    
    try{
      let result = query('SELECT chat_user.user_name,chat_log.time_sent,chat_log.message \
      FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id \
      WHERE chat_log.time_sent >= (SELECT latest_time_read \
      FROM join_group \
      WHERE join_user_id=? AND join_group_id=?);', [group.user_id, group.group_id], 'unexit group list', 1);
  
      // socket.emit('unexit group', [{ 'username': username, 'message': msg, 'timestamp': chatTimestamp }]);
      socket.emit('chat message', result);
    } catch(e){
      console.log(e);
    }
    
  })
  socket.on('chat message', function (msg) {
    if (author) {
      console.log('message from ' + name + ' : ' + msg.text + '  -- (' + msg.group + ')');
      //TODO: check with database if user join msg.group 
      //TODO: edit emit -> {name:name,msg:msg.txt}
      io.to(msg.group).emit('chat message', name + ' : ' + msg.text);
      //TODO: save message to data base
      //TODO: update last message time to database
    }
  });
  socket.on('disconnect', function (msg) {
    author = false
    console.log('user: ' + name + ' has disconnected.');
  });

  socket.on('createGroup', async (data, callback) => {
    console.log("Created group")
  })
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});

function query(sql, params, event, isEmitBack) {
  connectionPool.getConnection(function(err, connection) {
    connection.query( 'START TRANSACTION', function(err, rows) {
      // do all sql statements with connection and then

      connection.query(
        sql, params, (error, result) => {
          if (error) throw error;
          if(isEmitBack){
            socket.emit(event, result);
          }
          //let all = JSON.parse(JSON.stringify(result));
          console.log(result);
        }
      );

      connection.query( 'COMMIT', function(err, rows) {
         connection.release();
      });       
    });
  });


  
}
