-- create tablespace & database
CREATE TABLESPACE healthy_habits_space LOCATION '/var/lib/postgresql/data_db';
CREATE DATABASE healthy_habits TABLESPACE=healthy_habits_space;
