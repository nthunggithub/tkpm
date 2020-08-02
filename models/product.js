var mongoose = require('mongoose');
 //mongoose.connect('mongodb://localhost/shopping');
//mongoose.connect('mongodb+srv://admin:adminpassword@tanhung-o7d5l.mongodb.net/shopping?retryWrites=true&w=majority', {useUnifiedTopology: true});
var schema = mongoose.Schema;

var schema = new schema({
    IDSTall:{type: schema.Types.ObjectId, required:true},
    linkproduct: {type: String, require: true},
    imagePath: {type: String, require: true},
    productname: {type: String, require: true},
    saleoff: {type: String, require: true},
    price: {type: Number, require: true},
    oldprice: {type: Number, require: true},
    cat: {type: String, require: true},
    producer: {type: String, require: true},
    availability: {type: String, required: false},
    description: {type: String, required: false},
    gender: {type: String, required: false},
    qtysold :{type: Number, default: 0},
});

module.exports = mongoose.model("Product", schema);