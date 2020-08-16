var util = require('util');
//var db = require('../models/db');
const mysql = require("mysql");
var db=mysql.createConnection({
  host :  'localhost',
  user :  'root',  
  password : '0905172825',
  database : 'shopping'
});
db.connect((err)=>{

  if(err){
      throw err;
  }
  console.log('Mysql Connected')
})
var query = util.promisify(db.query).bind(db);

module.exports = query;