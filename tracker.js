//============================================================
//Dependencies
//============================================================
const inquirer = require("inquirer");
const mysql = require ("mysql");
const table = require("table");

const connection = mysql.createConnection({
    host: "localhost",
​
    // Your port; if not 3306
    port: 3306,
​
    // Your username
    user: "root",
​
    // Your password
    password: "password",
    database: "tracker_db"
});
​
connection.connect(function (err) {
    if (err) throw err;
    askQuestions();
});

//TODO: Build switch statement that allows for initilization questions
const askQuestions = () => {
    inquirer.prompt([
        {
            name: "mainMenuChoice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "Quit"
            ]
        }
        .then(({ mainMenuChoice }) => {
            switch (mainMenuChoice) {
                case "View all departments":
                    viewAllDepartments()
                    break;
                case "Quit":
                    connection.end()
                    break;
                default:
                    console.log("something went wrong")
                    break;
            }
        })
    ])
}

//TODO: Allow users to view departments
const viewAllDepartments = () => {
    connection.query("SELECT * FROM employeedb.department", function (err, data) {
        if (err) {
            throw err
        }
        console.table(data);
        askQuestions();
    })
}

//TODO: Allow users to view roles

//TODO: Allow user to view employees

//TODO: Allow user to add departments

//TODO: Allow user to add roles

//TODO: Allow user to add employees

//TODO: Allow user to update employee roles

//TODO: ==STRETCH== Allow user to update employee managers

//TODO: ==STRETCH== Allow user t oview all employees by manager

//TODO: ==STRETCH== Allow user to delete departments, roles, and employees

//TODO: ==STRETCH== Allow user to view the total utilized budget of a department (combined salaries of all employees in the department)