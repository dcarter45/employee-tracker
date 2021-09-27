
const fs = require(`fs`);
const inquirer = require(`inquirer`);
// const render = require(`./src/page-template.js`);
const path = require(`path`);
const mysql = require('mysql2');

// const Manager = require(`./lib/Manager`);
// const Engineer = require(`./lib/Engineer`);
// const Intern = require(`./lib/Intern`);

// const outputDirectory = path.resolve(__dirname,`dist`);
// const outputPath = path.join(outputDirectory,`index.html`);

let team=[];
let IDs=[];


function generateTeamPage(team){
    console.log(team);
    fs.writeFileSync(outputPath, render(team), `utf-8`);

}

askQuestions = () => {

    inquirer.prompt([
    {
            name: `userChoice`,
            type: `list`,
            message: `What would you like to do`,
            choices:['View All Employees',
        'Add Employee','Update Employee Role',
        'View All Roles', 'Add Role', 'View All Departments', 'Add Department'
    ]
    }]).then(response => {
        if (response.userChoice === 'View all employees') {
            viewAllEmployees()
        } else if (response.userChoice === 'View all departments') {
            viewAllDepartments()
        } else if (response.userChoice === 'View all roles') {
            viewAllRoles()
        } else if (response.userChoice === 'Add Department') {
            addDepartment()
        } else if (response.userChoice === 'Add Role') {
            addRole()
        } else if (response.userChoice === 'Add Employee') {
            addEmployee()
        } else if (response.userChoice === 'Update Employee Role') {
            updateEmployeeRole()
        }
        console.log(response);
    })

    
function addAllDepartments() {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What is the department name?',
        validate: department => {
            if (department) {
                return true;
            } else {
                console.log('Please enter the department name!');
                return false;
            }
        }
    }]).then( (answer)=> {
        connection.query('INSERT INTO department (name) VALUES (?)', [answer.department],
            function (error, results) {
                if (error) throw error;
                askQs()
            });
    });
};

}

askQuestions();