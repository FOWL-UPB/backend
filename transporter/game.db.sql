/* Drop Sequences for Autonumber Columns */

DROP SEQUENCE IF EXISTS game_id_game_seq
;

/* Drop Tables */

DROP TABLE IF EXISTS game CASCADE
;

/* Create Tables */

CREATE TABLE game
(
	id_game bigint NOT NULL   DEFAULT NEXTVAL(('"game_id_game_seq"'::text)::regclass),
	players text [] NULL,
	is_multiplayer boolean NULL,
	board text null,
	status text null,
	winner_id text NULL,
    date_game timestamp without time zone NULL
)
;

/* Create Primary Keys, Indexes, Uniques, Checks */

ALTER TABLE game ADD CONSTRAINT PK_game
	PRIMARY KEY (id_game)
;

/* Create Table Comments, Sequences for Autonumber Columns */

CREATE SEQUENCE game_id_game_seq INCREMENT 1 START 1
;
