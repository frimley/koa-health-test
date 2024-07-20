-- This script creates all of the DDL objects

-- create tablespace & database
CREATE TABLESPACE healthy_habits_space LOCATION '/var/lib/postgresql/data_db';
CREATE DATABASE healthy_habits TABLESPACE=healthy_habits_space;

-- create user for api
CREATE USER api WITH PASSWORD 'DataAccess0101!';

-- Table: user_account

CREATE TABLE IF NOT EXISTS public.user_account
(
    user_account_id uuid NOT NULL,
    username text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    created_timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT user_account_pkey PRIMARY KEY (user_account_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_account
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE ON public.user_account TO api;

-- Function creation

-- Registration
CREATE OR REPLACE FUNCTION fn_user_register(p_username text, p_email text, p_password text)
  RETURNS uuid as $$
DECLARE 
	created_user_account_id uuid = null;	
BEGIN
	-- check if user exists already?
	IF( NOT EXISTS(SELECT FROM user_account WHERE username = p_username OR email = p_email) )THEN
		-- Insert user and return Id..
		INSERT INTO user_account (username, email, password) VALUES (p_username, p_email, p_password) RETURNING user_account_id INTO created_user_account_id;
	END	IF;
	RETURN created_user_account_id;
END $$ LANGUAGE plpgsql;
GRANT EXECUTE ON FUNCTION fn_user_register(text,text,text) TO api;

-- Login
CREATE OR REPLACE FUNCTION fn_user_login(p_username text, p_password text)
  RETURNS uuid as $$
DECLARE 
	found_user_account_id uuid = null;	
BEGIN
	-- Does username & password match?
	SELECT user_account_id INTO found_user_account_id FROM user_account WHERE username = p_username AND password = p_password;
	RETURN found_user_account_id;
END $$ LANGUAGE plpgsql;
GRANT EXECUTE ON FUNCTION fn_user_login(text,text) TO api;

