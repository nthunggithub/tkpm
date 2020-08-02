var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')
var User = mongoose.Schema;

var User = new User({
    username: {type: String, require: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    secretToken: {type: String},
    active: {type: Boolean},
    name: {type: String, default: ''},
    nickname: {type: String, default: ''},
    phonenumber: {type: String, default: ''},
    gender: {type: Number, min: 0, max: 2}, //0 nam 1 nu 2 khac
    date: {type: String, default: ''},
    age: {type: Number, default: '', min: 8, max: 100},
    block: {type: Boolean, default: 0}
});

User.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

User.methods.comparePassword = function(password, hash){
    return bcrypt.compareSync(password, hash )};

module.exports = mongoose.model("users", User, "users");
