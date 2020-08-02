var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    phonenumber: {type: String, required: true},
    status: {type: Number, default: 0, min: 0, max: 3},
    methodpay: {type: Number, default: 0, min: 0, max: 1},
    date: {type: String},
})

module.exports = mongoose.model('Order', schema);