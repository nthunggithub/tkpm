var query = require('../models/db');
class order{
    static async updateStatusOrder(status, idorder){
        await query('update orders set Status = ? where ID_Order = ?', [status, idorder]);
    }
    static async deleteOrder(idorder){
        await query('delete from orders where ID_Order = ?', [idorder]);
    }
    static async addOrder(ID_Customer, createprice){
        await query('insert into orders set ? ', {
            ID_Customer: ID_Customer, DateCreated: new Date(),
            Amount: createprice, TypePayment: "", Address: "", Name: "", Phone: "", Status: 0
          });
    }
}

module.exports = order