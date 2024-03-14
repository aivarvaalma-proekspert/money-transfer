CREATE DATABASE mt_db;

CREATE USER mt_admin WITH ENCRYPTED PASSWORD 'mt_admin_pwd';
GRANT ALL PRIVILEGES ON DATABASE mt_db TO mt_admin;

CREATE ROLE mt_role NOLOGIN;
GRANT CONNECT ON DATABASE mt_db TO mt_role;

CREATE USER mt_user WITH ENCRYPTED PASSWORD 'mt_user_pwd';
GRANT mt_role TO mt_user;

\connect mt_db;
CREATE SCHEMA IF NOT EXISTS mt_schema AUTHORIZATION mt_admin;