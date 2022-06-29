drop table if exists chat;

create table chat(
	id serial,
	id_sender integer,
	id_game integer,
	message_sended varchar(1000),
	date timestamp,
	primary key(id)
)