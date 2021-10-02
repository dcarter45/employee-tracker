const cTable = require("console.table");
const fs = require(`fs`);
require('dotenv').config()
const inquirer = require(`inquirer`);
const path = require(`path`);
const mysql2 = require("mysql2");
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE,
});

const addEmployeeQuestions = ['What is the first name?', 'What is the last name?', 'What is their role?', 'Who is their manager?'];
const roleQuery = 'SELECT r.id AS value,  CONCAT(r.title, ", " , d.name) AS name from role r LEFT JOIN department d ON d.id = r.department_id'
// const mgrQuery = 'SELECT CONCAT (e.first_name," ",e.last_name) AS full_name, r.title, d.department_name FROM employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE department_name = "Management";'
const managerQuery='SELECT e.id AS value,CONCAT(e.first_name, ", " , last_name) AS name from employee e'



connection.connect();

let team = [];
let IDs = [];

function generateTeamPage(team) {
  console.log(team);
  fs.writeFileSync(outputPath, render(team), `utf-8`);
}

askQuestions = () => {
  inquirer
    .prompt([
      {
        name: `userChoice`,
        type: `list`,
        message: `What would you like to do?`,
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
        ],
      },
    ])
    .then((response) => {
      if (response.userChoice === "View All Employees") {
        viewAllEmployees();
      } else if (response.userChoice === "View All Departments") {
        viewAllDepartments();
      } else if (response.userChoice === "View All Roles") {
        viewAllRoles();
      } else if (response.userChoice === "Add Department") {
        addDepartments();
      } else if (response.userChoice === "Add Role") {
        addRole();
      } else if (response.userChoice === "Add Employee") {
        addEmployee();
      } else if (response.userChoice === "Update Employee Role") {
        updateEmployeeRole();
      }
    });
};

function addDepartments() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the department name?",
        validate: (department) => {
          if (department) {
            return true;
          } else {
            console.log("Please enter the department name!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.department],
        function (error, results) {
          if (error) throw error;
          console.log(`Added ${answer.department} to the database `)
          askQuestions();
        }
      );
    });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) throw error;
    console.table(results);
    askQuestions();
  });
}

const addEmployee = () => {
  connection.query(roleQuery, (err, results) => {
    connection.query(managerQuery, (err, managerResults) => {
    console.log(err, results);
      inquirer.prompt([
          {
              name: 'first_Name',
              type: 'input',
              message: addEmployeeQuestions[0]

          },
          {
              name: 'last_Name',
              type: 'input',
              message: addEmployeeQuestions[1]
          },
          {
              name: 'role',
              type: 'list',
              choices: results
              ,
              message: addEmployeeQuestions[2]

          },
          { name:'hasManager',
            type: 'list',
           
            message:`do they have a manager?`,
            choices: [`yes`,`no`]
          },
          {
              name: 'manager',
              default:null,
              when: (answers)=>{
                if (answers.hasManager=== `yes`){
                  return true
                }else{
                  return false
                }
              },
              type: 'list',
              choices: managerResults,
              message: addEmployeeQuestions[3]

            }
      ]).then((answer) => {
        console.log(answer);
        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)",
        [answer.first_Name, answer.last_Name, answer.role, answer.manager], 
        function (error, results) {
          
          if (error) throw error;
          console.log(`ADDED EMPLOYEE`);
          askQuestions();
        })
      })
})})};


function viewAllEmployees() {
  connection.query("SELECT * FROM department", function (error, results) {
    if (error) throw error;
    console.table(results);
    askQuestions();
  });
}

function promptRole(departments) {
  console.log(departments);
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the role?",
        validate: (role) => {
          if (role) {
            return true;
          } else {
            console.log("Please enter the role!");
            return false;
          }
        },
      },
    {
      name: `department`,
      type: `list`,
      message: `What department to add role to?`,
      choices: departments
      // somehow we need to format choices with the data in departments
      // ideally, we would show the user department name, but when they answer we would get department id
    },
    {
      name: `salary`,
      type: `input`,
      message: `What is the salary?`,
      validate: (salary) => {
        let parsedSalary = parseFloat(salary);
        if (Number.isNaN(parsedSalary) || parsedSalary<0) {
          console.log(`Please enter a valid positive salary`);
          return false;
        } else {
          return true;
        }
      },
    }
    
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role (title, department_id, salary) VALUES (?,?,?)",
        [answer.role, answer.department, answer.salary],
        function (error, results) {
          if (error) throw error;
          console.log(answer)
          askQuestions();
        }
      );
    });
}

function addRole() {
  connection.query(
    "SELECT id AS value, name FROM department",
    function (error, results) {
      if (error) throw error;
      console.log('departments', results);
      promptRole(results);
    }
  );
}


function updateEmployeeRole(){
    connection.query("SELECT * FROM ", function (error, results) {
        if (error) throw error;
        console.table(results)
        askQuestions();
      });
}

askQuestions();
