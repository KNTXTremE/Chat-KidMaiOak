var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var mysql = require("mysql");

config = require('./config.js');
var connection = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '0818382079',
  database: "parallel",
  port: "3306",
  dateStrings: true
});

connection.connect((err)=>{
  if(err) throw(err);
});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

groups = []

connection.query('SELECT group_name FROM chat_group;', function (err, row) {
  for (i = 0; i < row.length; i++) {
    groups.push(row[i].group_name)
  }
})

io.on('connection', function (socket) {
  var name;
  var author = false;
  console.log('connection');
  socket.emit('requestName',()=>{
    console.log("requestName")
  })
  socket.on('login', function (username) {
    console.log(username)
    connection.query('SELECT * FROM chat_user WHERE user_name = ?;', [username], function (err, row) {
      console.log(row)
      if (row.length == 0) {
        connection.query('insert into chat_user(user_name) values (?);', username);
        console.log('user: ' + username + ' has registered.');
      }
      connection.query('SELECT group_name,is_exist FROM chat_group,join_group,chat_user WHERE join_group_id = group_id and join_user_id = user_id AND user_name = ?;', username,function(err,row){
        for(let i=0;i<row.length;i++){
          if(row[i].is_exist === '1'){
            socket.join(row[i].group_name);
          }
        }
      })
      name = username;
      console.log('user: ' + name + ' has connected.');
      socket.emit('group list', groups);
      author = true;
    })
  });
  socket.on('create group', function (group) {
    if (author) {
      if (groups.indexOf(group) < 0) {
        // if group not in groups
        connection.query('INSERT INTO chat_group(group_name) VALUES(?);', [group], function (err, row) {
          groups.push(group)
          io.emit('new group', group)
          console.log('user : ' + name + ' create new group ,' + group)
        });
      }
    }
  });
    socket.on('is join group', function (group) {
    if (author) {
      console.log('is join group ?')
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        connection.query('select * from join_group,chat_group,chat_user where join_user_id = user_id and group_id = join_group_id and group_name = ? and user_name = ?;', [group, name], function (err, row) {
          if (row.length === 0) {
            socket.emit('is join',false);
            console.log('not join')
          }
          else {
            socket.emit('is join',true);
            console.log('already join')
          }
        })
      }
    }
  });
  socket.on('join group', function (group) {
    if (author) {
      if (groups.indexOf(group[0]) >= 0) {
        // if group in groups
        connection.query('select * from join_group,chat_group,chat_user where join_user_id = user_id and group_id = join_group_id and group_name = ? and user_name = ?;', [group, name], function (err, row) {
          if (row.length === 0) {
            connection.query('INSERT INTO join_group(join_user_id,join_group_id,is_exist,latest_time_read) VALUES ((SELECT user_id from chat_user where user_name = ?),(SELECT group_id from chat_group where group_name = ?),1,current_timestamp());', [name, group], function (err, row) {
              socket.join(group)
              socket.emit('is join',true);
              console.log('user : ' + name + ' join group ,' + group)
            })
          }
        })
      }
    }
  });
  socket.on('leave group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        // if group in groups
        connection.query('select * from join_group,chat_group,chat_user where join_user_id = user_id and group_id = join_group_id and group_name = ? and user_name = ?;', [group, name], function (err, row) {
          if (row.length === 0) {
            console.log('not already join')
            socket.emit('is join',false);
          }
          else {
            connection.query('DELETE FROM join_group WHERE join_user_id=(SELECT user_id from chat_user where user_name = ?) AND join_group_id=(SELECT group_id from chat_group where group_name = ?);', [name, group], function (err, row) {
              socket.leave(group)
              socket.emit('is join',false);
              console.log('user : ' + name + ' leave group ' + group)
            })
          }
        })
      }
    }
  });
  socket.on('exit group', function (group) {
    if (author) {
      if (groups.indexOf(group) >= 0) {
        connection.query('SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?;', name, function (err, row) {
          console.log(JSON.parse(JSON.stringify(row)))
          if (row.length === 0) {
            console.log('not already join')
          }
          else {
            connection.query('UPDATE join_group SET is_exist = 0, latest_time_read = current_timestamp() \
            WHERE join_user_id = (Select user_id from chat_user where user_name = ?) and \
            join_group_id = (select group_id from chat_group where group_name = ?);', [name, group], function (err, row) {
                socket.leave(group)
              });
            console.log('user : ' + name + ' exit group ' + group)
          }
        })
      }
    }
  });
  socket.on('unexit group', function (group) {
    if (author) {
      connection.query('select is_exist from join_group where join_user_id = (Select user_id from chat_user where user_name = ?) and join_group_id = (select group_id from chat_group where group_name = ?)', [name, group], function (err, row) {
        if (JSON.parse(JSON.stringify(row)).is_exist === 1) {
          //reload chat after server is down and reconnected
          //means that when server is down, is_exist still 1 but the truth is it already crashed. So it needs to be reload chat.
          console.log('reloading chat')
          connection.query('SELECT chat_user.user_name,chat_log.time_sent,chat_log.message \
          FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id \
          WHERE chat.chat_group_id = (select group_id from chat_group where group_name = ?) ORDER by chat_log.time_sent', group, function (err, row) {
              chat = JSON.parse(JSON.stringify(row))
              for (i = 0; i < chat.length; i++) {
                socket.emit('get unread chat', chat[i]);
                console.log(chat[i]);
              }
            })
        }
        else {
          console.log('user : ' + name + ' read unread message in group ' + group)
          socket.join(group)
          connection.query('SELECT chat_user.user_name,chat_log.time_sent,chat_log.message \
      FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id \
      WHERE chat_log.time_sent >= (SELECT latest_time_read FROM join_group WHERE join_user_id=(Select user_id from chat_user where user_name = ?) AND join_group_id=(select group_id from chat_group where group_name = ?)) ORDER by chat_log.time_sent;', [name, group], function (err, row) {
              chat = JSON.parse(JSON.stringify(row))
              for (i = 0; i < chat.length; i++) {
                socket.emit('get unread chat', chat[i]);
                console.log(chat[i]);
              }
            })
        }
      })
    }
  });
  socket.on('chat message', function (msg) {
    if (author) {
      console.log('message from ' + name + ' : ' + msg.text + '  -- (' + msg.group + ')');
      //TODO: check with database if user join msg.group 
      //TODO: edit emit -> {name:name,msg:msg.txt}
      io.to(msg.group).emit('chat message', { user_name: name, timestamp: Math.floor(Date.now() / 1000), message: msg.text });
      //TODO: save message to data base
      connection.query('INSERT INTO chat_log(time_sent,message) VALUES(current_timestamp(),?);', msg.text);
      connection.query('INSERT INTO chat(chat_user_id,chat_group_id,chat_chat_id) VALUES((Select user_id from chat_user where user_name = ?),(select group_id from chat_group where group_name = ?),(SELECT chat_id FROM chat_log ORDER BY chat_id DESC LIMIT 1));', [name, msg.group]);
      //TODO: update last message time to database
    }
  });
  socket.on('disconnect', function (msg) {
    author = false
    console.log('user: ' + name + ' has disconnected.');
  });
});

http.listen(port, function () {
  console.log('listening on port:' + port);
});