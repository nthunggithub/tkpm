var query = require('../models/db');
class comment{
      static async addcomment(ID_Customer, ID_Book, comment){
        await query('insert into comment set ?', [{ ID_Customer: ID_Customer, ID_Book: ID_Book, Comment: comment, DateComment: new Date() }]);
    }
}

module.exports = comment;