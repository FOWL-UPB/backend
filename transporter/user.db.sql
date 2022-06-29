/* Drop Sequences for Autonumber Columns */

DROP SEQUENCE IF EXISTS user_id_user_seq
;

/* Drop Tables */

DROP TABLE IF EXISTS "user" CASCADE
;

/* Create Tables */

CREATE TABLE "user"
(
	id_user bigint NOT NULL   DEFAULT NEXTVAL(('"user_id_user_seq"'::text)::regclass),
	user_name text NULL,
	profile_url text NULL,
	theme text NULL,
	ads boolean NULL,
	email text NULL,
	password text NULL,
	level text [] NULL
)
;

/* Create Primary Keys, Indexes, Uniques, Checks */

ALTER TABLE "user" ADD CONSTRAINT PK_user
	PRIMARY KEY (id_user)
;

/* Create Table Comments, Sequences for Autonumber Columns */

CREATE SEQUENCE user_id_user_seq INCREMENT 1 START 1
;