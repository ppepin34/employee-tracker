const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');
const {viewDepartments} = require('./script/view');

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

init();

module.exports = { mainMenu };