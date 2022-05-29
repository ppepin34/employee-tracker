const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const { connect } = require('./db/connection');

function init() {
    console.log('Employee Manager');
    mainMenu();
};

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
            }
        ])
        .then((answers) => {
            if (answers.menu === 'Quit') {
                console.log('Goodbye!');
                process.exit();
            } else if (answers.menu === 'View all departments') {
                viewDepartments()
            } else if (answers.menu === 'View all roles') {
                viewRoles()
            } else if (answers.menu === 'View all employees') {
                viewEmployees()
            } else if (answers.menu === 'Add a department') {
                addDepartment()
            } else if (answers.menu === 'Add a role') {
                addRole()
            } else if (answers.menu === 'Add an employee') {
                addEmployee()
            }
        })
};

function viewDepartments() {

    let sql = `SELECT department.id AS id, department.name AS 'Department' FROM department`;
    db.query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        mainMenu();
    });
};

function viewRoles() {
    let sql = `SELECT title AS 'Title', salary AS 'Salary', name AS 'Department'
    FROM roles
    LEFT JOIN department
    ON roles.department_id = department.id`;

    db.query(sql, (error, results) => {
        if (error) throw error;
        console.table(results);
        mainMenu();
    });
};

function viewEmployees() {
    let sql = `SELECT e.id, 
    e.first_name AS 'First Name', 
    e.last_name AS 'Last Name', 
    r.title AS 'Title', 
    r.salary AS 'Salary',
    d.name AS 'Department',
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee AS e
    LEFT JOIN roles as r
    ON e.role_id = r.id
    LEFT JOIN department as d
    ON r.department_id = d.id
    LEFT JOIN employee AS m
    ON e.manager_id = m.id`;

    db.query(sql, (error, results) => {
        if (error) throw error;
        console.table(results);
        mainMenu();
    });
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of this department?'
            }
        ])
        .then((answer) => {

            let sql = `INSERT INTO department (name)
            VALUES (?)`;

            let params = [answer.department]

            db.query(sql, params, (error, results) => {
                if (error) throw error;
                mainMenu();
            });
        });
};

function addRole() {

    let departmentQuery = `SELECT * FROM department`;
    let departments

    db.query(departmentQuery, (error, results) => {
        if (error) throw error;
        departments = results;

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of this role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for this role?',
                    validate: (answer) => {
                        if (isNaN(answer)) {
                            return "Please enter a number";
                        }
                        return true;
                    },
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: function () {
                        let choiceArray = departments.map(choice => choice.name);
                        return choiceArray
                    }
                }
            ])
            .then((answers) => {
                db.query(
                    `INSERT INTO roles(title, salary, department_id)
                VALUES ("${answers.title}", "${answers.salary}", 
                (SELECT id FROM department WHERE name = "${answers.department}"))`
                )
                mainMenu();
            })
    });
};

function addEmployee() {
    let roles
    let employees
    db.query(`SELECT title FROM roles`, (error, results) => {
        if (error) throw error;
        roles = results;
        db.query(`SELECT CONCAT (e.first_name, ' ', e.last_name) AS full_name FROM employee AS e`, (error, results) => {
            if (error) throw error;
            employees = results

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: "What is the employee's last name?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What role is the employee filling?',
                        choices: function () {
                            let choiceArray = roles.map(choice => choice.title);
                            return choiceArray;
                        }
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: function () {
                            let choiceArray = employees.map(choice => choice.full_name);
                            choiceArray.push('None');
                            return choiceArray;
                        }
                    }
                ])
                .then((answers) => {
                    let manager

                    if (answers.manager === 'None') {
                        manager = 'null'
                        console.log('hi');
                    } else {
                        manager = `(SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answers.manager}")`;
                    }
                    let sql =
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answers.first_name}", "${answers.last_name}", 
                    (SELECT id FROM roles WHERE title = "${answers.role}"), ${manager})`;

                    db.query(sql)
                    mainMenu();
                })
        }
        )
    })
};

init();