const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

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
            }
        })
}

init()