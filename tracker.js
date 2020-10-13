//============================================================
//Dependencies
//============================================================
const inquirer = require("inquirer");
const mysql = require ("mysql");
const ctable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "employeedb"
});
connection.connect(function (err) {
    if (err) throw err;
    askQuestions();
});

//TODO: Build switch statement that allows for initilization questions
const askQuestions = (data) => {
    console.table(data);
    inquirer.prompt([
        {
            name: "mainMenuChoice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all employees",
                "Quit"
            ]
        }
    ]).then(({ mainMenuChoice }) => {
        switch (mainMenuChoice) {
            case "View all departments":
                viewAllDepartments()
                break;
                case "View all employees":
                viewAllEmployees()
                break;
            case "Quit":
                connection.end()
                break;
            default:
                console.log("something went wrong")
                break;
        }
    })
}

//TODO: Allow users to view departments
const viewAllDepartments = () => {
    connection.query("SELECT * FROM employeedb.department", function (err, data) {
        if (err) {
            throw err
        }
        askQuestions(data);
    })
}

//TODO: Allow users to view roles

//TODO: Allow user to view employees
const viewAllEmployees = () => {
    connection.query("SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, roles.title, roles.salary, department.name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id", function (err, data) {
        if (err) {
            throw err
        }
        askQuestions(data);
    })
}

//TODO: Allow user to add departments
const addNewDepartment = () => {
    inquirer.prompt([
        {
            name: "newDepartmentChoice",
            type: "input",
            message: "What would you like to call the new department?",
        }
    ]).then(answers => {
        connection.query("INSERT INTO department (name) VALUES (answers.newDepartmentChoice)"), function (err, data) {
            if (err) {
                throw err
            }
            askQuestions(data);
        }
    })
}


//TODO: Allow user to add roles

//TODO: Allow user to add employees

//TODO: Allow user to update employee roles

//TODO: ==STRETCH== Allow user to update employee managers

//TODO: ==STRETCH== Allow user t oview all employees by manager

//TODO: ==STRETCH== Allow user to delete departments, roles, and employees

//TODO: ==STRETCH== Allow user to view the total utilized budget of a department (combined salaries of all employees in the department)