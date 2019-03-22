DROP DATABASE IF EXISTS parallel;

create database parallel;
use parallel;
create table chat_user(
	user_id int auto_increment,
    user_name varchar(30) not null,
    primary key (user_id)
    );
create table chat_group(
	group_id int auto_increment,
    group_name varchar(30) not null,
    primary key (group_id)
    );
create table join_group(
	join_user_id int references chat_user(user_id),
    join_group_id int references chat_group(group_id),
    is_exist varchar(1) not null,
    latest_time_read timestamp not null default 0,
    primary key (join_user_id,join_group_id)
    );
create table chat_log(		
	chat_id int auto_increment,
    time_sent timestamp not null,
    message longtext not null,
    primary key (chat_id)
	);
create table chat(
	chat_user_id int references chat_user(user_id),
    chat_group_id int references chat_group(group_id),
    chat_chat_id int references chat_log(chat_id),
    sequence_number int,
    primary key (chat_user_id,chat_group_id,chat_chat_id)
	);