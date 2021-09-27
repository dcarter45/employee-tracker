DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
  id INT NOT NULL,
  name VARCHAR(100) NOT NULL
);

employeetracker_db();