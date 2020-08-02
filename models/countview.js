module.exports = function countview(oldview) {
    this.views = oldview.views || {};

    this.add = function(id) {
        var storedview = this.views[id];
        if (!storedview) {
            storedview = this.views[id] = {qty: 0};
        }
        storedview.qty++;
    };
    
    //object key: value sang array
    this.generateArray = function() {
        var arr = [];
        for (var id in this.views) {
            arr.push(this.views[id]);
        }
        return arr;
    };
    this.showtoOne = function(id){
        for(var indexid in this.views){
            if(indexid == id){
                return this.views[id].qty;
            }
        }
        return 0;
    }
};

