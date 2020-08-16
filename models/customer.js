var query = require('../models/db');
var bcrypt = require('bcrypt-nodejs')
class customer{
    static async addcustomer(user){
        await query('INSERT INTO customer SET ? ', user);
    };
    static async updateCustomer(name, phonenumber, gender, address, date, email, ID_Customer){
        await query('update customer set FullName = ?, Phone = ?, Gender = ?,Address = ?, Birthday=?, Email = ?'+
        ' where ID_Customer = ?', [name, phonenumber, gender, address, date, email, ID_Customer])
    }
    hashPassword(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    };
    
    comparePassword(password, hash){
        return bcrypt.compareSync(password, hash )
    };
    
}

module.exports = customer;