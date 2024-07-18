-- This script creates all of the DDL objects

-- create database
CREATE DATABASE healthy_habits;
-- create user for api
CREATE USER api WITH PASSWORD 'FastDataAccess0101!';

-- users

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id uuid NOT NULL,
    username text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    created_timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT user_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;