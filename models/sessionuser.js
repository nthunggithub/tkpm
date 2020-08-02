var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    cart: {type: Object},
    countview: {type: Object}
})

module.exports = mongoose.model('sessionuser', schema);