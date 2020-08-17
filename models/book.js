const query = require('../models/db');
class book {

    static addBook() {

    };
    static updateBook() {

    };
    static deleteBook() {

    };
    static async searchBook(SortPrice, FilterCategory, FilterAuthor, Filterprice, Filtersearch) {
        let querysortprice = {};
        if (SortPrice == "gia-giam") {
            querysortprice = { price: -1 }
        } else if (SortPrice == "gia-tang") {
            querysortprice = { price: 1 }
        }

        const producttype = FilterCategory;
        const author = FilterAuthor;
        const price = Filterprice;
        let queryfilter = {};
        queryfilter['cat'] = "all1";
        queryfilter['author'] = "all2";
        queryfilter['price'] = {};
        if (producttype !== undefined)
            queryfilter['cat'] = producttype;
        if (author !== undefined)
            queryfilter['author'] = author;
        if (price !== undefined) {
            if (price === 'duoi-1-tram') {
                queryfilter.price['gte'] = 0;
                queryfilter.price['lte'] = 100000;
            } else if (price == 'tu-1-tram-5-tram') {
                queryfilter.price['gte'] = 100000;
                queryfilter.price['lte'] = 500000;
            } else if (price == 'tren-5-tram') {
                queryfilter.price['gte'] = 500000;
                queryfilter.price['lte'] = -1;
            }
        }

        var search = Filtersearch;
        var querysearch = '';
        let data;
        if (search != undefined) {
            querysearch = search;
            data = await query(`select * from book b inner join author a inner join category c where c.ID_Category = b.ID_Category`
                + ` and a.ID_Author = b.ID_Author and b.NameBook LIKE '%` + search + `%'`);
        } else {
            data = await query('select * from book b inner join author a inner join category c where c.ID_Category = b.ID_Category'
                + ' and a.ID_Author = b.ID_Author');
        }


        let products = [];
        let books = JSON.parse(JSON.stringify(data));
        for (let book of books) {
            if ((book.NameCategory == queryfilter.cat || queryfilter.cat == 'all1') && (book.NameAuthor == queryfilter.author || queryfilter.author == 'all2')) {
                if (JSON.stringify(queryfilter.price) === '{}')
                    products.push(book);
                else if ((book.Price < queryfilter.price.lte && book.Price > queryfilter.price.gte) ||
                    (queryfilter.price.lte == -1 && book.Price > queryfilter.price.gte)) {
                    products.push(book);
                }
            }
        }
        Array.prototype.sortBy = function (p) {
            return this.slice(0).sort(function (a, b) {
                return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
            });
        }
        //sap xep tang giam sort mang limitproducts
        if (JSON.stringify(querysortprice) !== '{}') {
            products = products.sortBy('Price')
            if (querysortprice.price == -1) {
                products.reverse();
            }
        }
        return products;
    }
    static async ThongkeSachTon(ID_Book) {
        let book = await query('select * from book where ID_Book = ?', [ID_Book]);
        return book[0].Quantity_Book;
    };
    static formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
};

module.exports = book;