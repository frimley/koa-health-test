-- This script creates all of the DDL objects

-- create tablespace & database
CREATE TABLESPACE healthy_habits_space LOCATION '/var/lib/postgresql/data_db';
CREATE DATABASE healthy_habits TABLESPACE=healthy_habits_space;

-- enable encryption functionality
CREATE EXTENSION pgcrypto;

-- create user for api
CREATE USER api WITH PASSWORD 'DataAccess0101!';

---------------------
-- Table creation
---------------------

-- user_account

CREATE TABLE IF NOT EXISTS public.user_account
(
    user_account_id uuid NOT NULL,
    username text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    created_timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT user_account_pkey PRIMARY KEY (user_account_id)
)
TABLESPACE healthy_habits_space;

ALTER TABLE IF EXISTS public.user_account
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE ON public.user_account TO api;

-- activity_category

CREATE TABLE IF NOT EXISTS public.activity_category
(
    activity_category_id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT activity_category_pkey PRIMARY KEY (activity_category_id)
)
TABLESPACE healthy_habits_space;

ALTER TABLE IF EXISTS public.activity_category
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE ON public.activity_category TO api;

-- activity_difficulty

CREATE TABLE IF NOT EXISTS public.activity_difficulty
(
    activity_difficulty_id integer NOT NULL,
    name text COLLATE pg_catalog."default",
    CONSTRAINT activity_difficulty_pkey PRIMARY KEY (activity_difficulty_id)
        USING INDEX TABLESPACE healthy_habits_space
)
TABLESPACE healthy_habits_space;

ALTER TABLE IF EXISTS public.activity_difficulty
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE ON public.activity_difficulty TO api;

-- activity

CREATE SEQUENCE IF NOT EXISTS public.activity_activity_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.activity_activity_id_seq
    OWNED BY public.activity.activity_id;

ALTER SEQUENCE public.activity_activity_id_seq
    OWNER TO postgres;

GRANT USAGE, SELECT ON SEQUENCE public.activity_activity_id_seq TO api;

CREATE TABLE IF NOT EXISTS public.activity
(
    activity_id bigint NOT NULL DEFAULT nextval('activity_activity_id_seq'::regclass),
    title text COLLATE pg_catalog."default",
    activity_category_id integer,
    duration_minutes integer,
    activity_difficulty_id integer,
    content text COLLATE pg_catalog."default",
    created_timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT activity_pkey PRIMARY KEY (activity_id)
        USING INDEX TABLESPACE healthy_habits_space
)
TABLESPACE healthy_habits_space;

ALTER TABLE IF EXISTS public.activity
    OWNER to postgres;

GRANT UPDATE, INSERT, SELECT ON TABLE public.activity TO api;
GRANT ALL ON TABLE public.activity TO postgres;

-- user_activity_completed

CREATE SEQUENCE IF NOT EXISTS public.user_activity_completed_user_activity_completed_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.user_activity_completed_user_activity_completed_id_seq
    OWNED BY public.user_activity_completed.user_activity_completed_id;

ALTER SEQUENCE public.user_activity_completed_user_activity_completed_id_seq
    OWNER TO postgres;

GRANT USAGE, SELECT ON SEQUENCE public.user_activity_completed_user_activity_completed_id_seq TO api;

CREATE TABLE IF NOT EXISTS public.user_activity_completed
(
    user_activity_completed_id bigint NOT NULL DEFAULT nextval('user_activity_completed_user_activity_completed_id_seq'::regclass),
    activity_id bigint,
    user_account_id uuid,
    created_timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT user_activity_completed_pkey PRIMARY KEY (user_activity_completed_id)
        USING INDEX TABLESPACE healthy_habits_space
)

TABLESPACE healthy_habits_space;

ALTER TABLE IF EXISTS public.user_activity_completed
    OWNER to postgres;

GRANT SELECT, INSERT, UPDATE ON public.user_activity_completed TO api;

---------------------
-- Function creation
---------------------

-- Registration
CREATE OR REPLACE FUNCTION fn_user_register(p_username text, p_email text, p_password text)
  RETURNS uuid as $$
DECLARE 
	created_user_account_id uuid = null;	
BEGIN
	-- check if user exists already?
	IF( NOT EXISTS(SELECT FROM user_account WHERE username = p_username OR email = p_email) )THEN
		-- Insert user and return Id..
		INSERT INTO user_account (username, email, password) VALUES (p_username, p_email, crypt(p_password, gen_salt('md5'))) RETURNING user_account_id INTO created_user_account_id;
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
	SELECT 
		user_account_id INTO found_user_account_id
	FROM user_account WHERE username = p_username AND crypt(p_password, password) = password;
	RETURN found_user_account_id;
END $$ LANGUAGE plpgsql;
GRANT EXECUTE ON FUNCTION fn_user_login(text,text) TO api;

-- Get activities
CREATE OR REPLACE FUNCTION fn_get_activities()
RETURNS TABLE(activity_id bigint, title text, category text, duration_minutes integer, difficulty text, content text, created_timestamp timestamp)
AS $$
	SELECT 
		a.activity_id,
		a.title,
		ac.name as category,
		a.duration_minutes,
		ad.name as difficulty,
		a.content,
		a.created_timestamp
	FROM activity a
	INNER JOIN activity_category ac ON a.activity_category_id = ac.activity_category_id
	INNER JOIN activity_difficulty ad ON a.activity_difficulty_id = ad.activity_difficulty_id
	ORDER BY
		ac.name
	
$$ LANGUAGE sql;
GRANT EXECUTE ON FUNCTION fn_get_activities() TO api;

-- Set activity completed
CREATE OR REPLACE FUNCTION fn_set_activity_completed(p_user_account_id uuid, p_activity_id bigint)
RETURNS VOID AS $$
BEGIN
	INSERT INTO user_activity_completed (activity_id, user_account_id) VALUES (p_activity_id, p_user_account_id);
END;
$$ LANGUAGE plpgsql;
GRANT EXECUTE ON FUNCTION fn_set_activity_completed(uuid,bigint) TO api;

-- Get completed activities
CREATE OR REPLACE FUNCTION fn_get_completed_activities(p_user_account_id uuid)
RETURNS TABLE(activity_id bigint, title text, category text, duration_minutes integer, difficulty text, content text, completed_timestamp timestamp)
AS $$
	SELECT 
		a.activity_id,
		a.title,
		ac.name as category,
		a.duration_minutes,
		ad.name as difficulty,
		a.content,
		uac.created_timestamp
	FROM activity a
	INNER JOIN activity_category ac ON a.activity_category_id = ac.activity_category_id
	INNER JOIN activity_difficulty ad ON a.activity_difficulty_id = ad.activity_difficulty_id
	INNER JOIN user_activity_completed uac ON uac.activity_id = a.activity_id
	WHERE 
		uac.user_account_id = p_user_account_id
	ORDER BY
		uac.created_timestamp DESC
	
$$ LANGUAGE sql;
GRANT EXECUTE ON FUNCTION fn_get_completed_activities(uuid) TO api;

