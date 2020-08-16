var util = require('util');
require('dotenv').config();
const mysql = require("mysql");
var db=mysql.createConnection({
  host :  'localhost',
  user :  'root',  
  password : process.env.passmysql,
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