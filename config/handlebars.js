var handlebars = require('handlebars');
var formatDecimal = require('format-decimal');

handlebars.registerHelper('convertmoney', function(money, discount){
    if(money == undefined)
        return "";
    const currentmoney = Math.round(money * (100 - discount)/100);
    return formatDecimal(currentmoney,{precision: 0})+"đ";
})
handlebars.registerHelper('for', function(n, block) {
    var allblock = '';
    for(var i = 1; i <= n; ++i) {
        block.data.index = i;
        allblock += block.fn(this);
    }
    return allblock;
});

handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('selectproducts', function(v1, v2, label) {
    if(v1 == v2) {
        return new handlebars.SafeString('<option value="' + v2 + '\" class=\"btn\" selected = "selected"> ' + label + '</option>');
    }
    return new handlebars.SafeString('<option value="' + v2 + '\" class=\"btn\"> ' + label + '</option>');
});


// handlebars.registerHelper('totalmoney', function(v1, v2, options) {
//     if(v1 == undefined || v2 == undefined) {
//         return 0;
//     }
//     return v1 * v2;
// });
handlebars.registerHelper('option', function(value, label, selectedValue) {
    var selectedProperty = value == selectedValue ? 'selected="selected"' : '';
    return new handlebars.SafeString('<option value="' + value + '"' +  selectedProperty + '>' + label + "</option>");
  });