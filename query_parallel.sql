use parallel;
insert into chat_user values (NULL,'punsa');
insert into chat_user values (NULL,'tamtam');
insert into chat_user values (NULL,'ongeiei');
insert into chat_user values (NULL,'gungun');
insert into chat_user values (NULL,'zizizi');
insert into chat_group values (NULL,'CP43');


INSERT INTO chat_group(group_id) VALUES (?); INSERT INTO join_group(user_name, group_id) VALUES (?, ?);

# createUser
INSERT INTO chat_user(user_id,user_name) VALUES (NULL,?); 

#createGroup
INSERT INTO chat_group(group_id,group_name) VALUES (NULL, ?);

#joinGroup
INSERT INTO join_group(join_user_id,join_group_id,is_exist,latest_time_read) VALUES (?,?,1,NULL);

#leaveGroup
SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?;
SELECT join_group.join_group_id FROM join_group JOIN chat_group WHERE join_group.join_group_id = chat_group.group_id AND chat_group.group_name=?;
DELETE FROM join_group WHERE join_user_id=? AND join_group_id=?;

#exitGroup
SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?;
SELECT join_group.join_group_id FROM join_group JOIN chat_group WHERE join_group.join_group_id = chat_group.group_id AND chat_group.group_name=?;
UPDATE join_group SET is_exist=0,latest_time_read=current_timestamp() WHERE join_user_id=? AND join_group_id=?;

#getJoinedGroup
SELECT join_group.join_user_id FROM join_group JOIN chat_user WHERE join_group.join_user_id = chat_user.user_id AND chat_user.user_name=?;
SELECT join_group.join_group_id FROM join_group JOIN chat_group WHERE join_group.join_group_id = chat_group.group_id AND chat_group.group_name=?;
SELECT chat_group.group_name FROM chat_group JOIN join_group ON chat_group.group_id = join_group.join_group_id WHERE join_group.join_user_id=?;

#getAllGroup
SELECT group_name FROM (chat_group JOIN join_group ON chat_group.chat_group_id = join_group.join_group_id) JOIN chat_user WHERE chat_user.chat_user_id=?;
SELECT group_name FROM chat_group;

#sendMessage
SELECT chat_log.chat_id FROM chat_log JOIN join_group WHERE join_group.join_group_id=?;
SELECT chat.chat_user_id,chat.chat_group,chat.chat_chat_id FROM chat JOIN join_group WHERE join_group.join_user_id=? AND join_group.join_group_id=?;
INSERT INTO chat_log(chat_id,time_sent,message) VALUES(NULL,current_timestamp(),?);
INSERT INTO chat(chat_user_id,chat_group_id,chat_chat_id) VALUES(?,?,?); 

#getUnread
SELECT chat_user.user_name,chat_log.time_sent,chat_log.message 
FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id 
WHERE chat_log.time_sent >= (SELECT latest_time_read
FROM join_group
WHERE join_user_id=? AND join_group_id=?);

#getMeassage
SELECT chat_user.user_name,chat_log.time_sent,chat_log.message
FROM (chat_user JOIN chat ON chat_user.user_id = chat.chat_user_id) JOIN chat_log ON chat_log.chat_id = chat.chat_chat_id 
WHERE chat_group.chat_group_id = ? AND chat_user.user_id = ?;




