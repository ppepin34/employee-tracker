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
            }
        })
};

function viewDepartments() {

    let sql  = `SELECT department.id AS id, department.name AS 'Department' FROM department`;
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

init();