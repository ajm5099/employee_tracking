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

// Build switch statement that allows for initilization questions
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
                "View all roles",
                "Add a new department",
                "Add a new role",
                "Add a new employee",
                "Update an employees role",
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
            case "View all roles":
                viewAllRoles()
                break;
            case "Add a new department":
                addNewDepartment()
                break;
            case "Add a new role":
                addNewRole()
                break;
            case "Add a new employee":
                addNewEmployee()
                break;
            case "Update an employees role":
                updateEmployeeRole()
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

//Allow users to view all employees in departments
const viewAllDepartments = () => {
    connection.query("SELECT * FROM employeedb.department", function (err, data) {
        if (err) {
            throw err
        }
        askQuestions(data);
    })
}

//Allow users to view all employees
const viewAllRoles = () => {
    connection.query("SELECT * FROM employeedb.role", function (err, data) {
        if (err) {
            throw err
        }
        askQuestions(data);
    })
}

//Allow user to view employees
const viewAllEmployees = () => {
    connection.query("SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, data) {
        if (err) {
            throw err
        }
        askQuestions(data);
    })
}

//Allow user to add departments
function addNewDepartment() {
    inquirer.prompt([
        {
            name: "newDepartmentChoice",
            type: "input",
            message: "What would you like to call the new department?",
        }
    ]).then (function(response) {
        connection.query("INSERT INTO department SET ?", {
            name:response.newDepartmentChoice
        }, function (err, data) {
            if (err) {
                throw err
            }
            askQuestions(data);
        })
    })
}

//Allow user to add roles
function addNewRole() {
    inquirer.prompt([
        {
            name: "newRoleTitle",
            type: "input",
            message: "What would you like to call the new role?",
        }, {
            name: "newRoleSalary",
            type: "input",
            message: "What is the salary for this role?",
        }, {
            name: "newRoleDepartment",
            type: "input",
            message: "What is the department for this role?",
        },

    ]).then (function(response) {
        connection.query("INSERT INTO role SET ?", {
            title:response.newRoleTitle,
            salary:response.newRoleSalary,
            department_id:response.newRoleDepartment
        }, function (err, data) {
            if (err) {
                throw err
            }
            askQuestions(data);
        })
    })
}

// Allow user to add employees
function addNewEmployee() {
    inquirer.prompt([
        {
            name: "newEmployeeFirstName",
            type: "input",
            message: "What is the employees first name?",
        }, {
            name: "newEmployeeLastName",
            type: "input",
            message: "What is the employees last name?",
        }, {
            name: "newEmployeeID",
            type: "input",
            message: "What is the employees role ID?",
        }, {
            name: "newEmployeeManager",
            type: "input",
            message: "What is the employees manager ID?",
        },

    ]).then (function(response) {
        connection.query("INSERT INTO employee SET ?", {
            first_name:response.newEmployeeFirstName,
            last_name:response.newEmployeeLastName,
            role_id:response.newEmployeeID,
            manager_id: response.newEmployeeManager
        }, function (err, data) {
            if (err) {
                throw err
            }
            askQuestions(data);
        })
    })
}

// Allow user to update employee roles
const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employeedb.employee", function (err, data) {
        if (err) throw err
        inquirer.prompt([
            {
            type: "list",
            name: "employeeSelect",
            message: "Which employee name do you wish to update?",
            choices: function () {
                const choicesArray = []
                for (let i = 0; i < data.length; i++) {
                    choicesArray.push({
                        name: data[i].first_name + " " + data[i].last_name,
                        value:data[i].id
                    })
                }
                return choicesArray
            }
        }, {
            type: "list",
            name: "newRole",
            message: "What is the employees new role?",
            choices: function () {
                const roleChoicesArray = []
                for (let i = 0; i < data.length; i++) {
                    roleChoicesArray.push(data[i].role_id)
                }
                return roleChoicesArray
            }
        }
    ]).then(({ employeeSelect, newRole}) => {
        connection.query("UPDATE employee SET ? WHERE  ?", [{
            role_id: newRole,
        }, {
            id: employeeSelect
        }], (err, data) => {
            if (err) throw err
        })
        askQuestions(data);
    })   
    })
}


//TODO: ==STRETCH== Allow user to update employee managers

//TODO: ==STRETCH== Allow user t oview all employees by manager

//TODO: ==STRETCH== Allow user to delete departments, roles, and employees

//TODO: ==STRETCH== Allow user to view the total utilized budget of a department (combined salaries of all employees in the department)