DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE `role` (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8,2) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  UNIQUE(title,department_id),
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NULL,
  manager_id INT UNSIGNED,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON DELETE SET NULL,
  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
  ON DELETE SET NULL
);

