const db = require('../db/connection');
const cTable = require('console.table');
const  mainMenu  = require('../index');

function viewDepartments (){
    console.log('viewDepartments');
    db.promise().query(
        'SELECT * FROM `department`',
        function(err, results){
            console.table(results);
            // mainMenu();
        }
    )
    // .then(() => {
        mainMenu();
    // })
}

module.exports = {viewDepartments}