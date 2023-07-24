CREATE DATABASE todoapp;

CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    title VARCHAR(60),
    progress INT,
    date timestamp
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);