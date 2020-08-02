var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
    comment : {type: String, require: true},   
    postId :{type: String, require: true},   
    name: {type: String, require: true},
    star: {
        type: Number,
        default: 5
      }   
});
module.exports = mongoose.model('Comments', Comments);