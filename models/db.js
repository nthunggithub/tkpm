var util = require('util');
//var db = require('../models/db');
const mysql = require("mysql");
const { model } = require('./product');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nthung',
  database: 'shopping'
});

db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('mysql connect');
})
var query = util.promisify(db.query).bind(db);

module.exports = query;