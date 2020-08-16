var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
const mysql = require("mysql");
var util = require('util');
const customer = require('../models/customer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'khiemkhiem841999',
    database: 'shopping'
});

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('mysql connect');
})
const query = util.promisify(db.query).bind(db);


passport.serializeUser(function (user, done) {
    //done(null, user.id);

    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    const sql = 'SELECT * FROM customer where ID_Customer = ?';
    db.query(sql, id, (err, data) => {
        const test = [];
        //const x  = await User.findOne({ username: 'nthungnt2608' });
        result = data[0];
        let user = new customer();
        user.ID_Customer = result.ID_Customer;
        user.UserName = result.UserName;
        user.PassWord = result.PassWord;
        user.FullName = result.FullName;
        user.Gender = result.Gender;
        user.Email = result.Email;
        user.Phone = result.Phone;
        user.Address = result.Address;

        result.Birthday.setDate(result.Birthday.getDate() + 1);
        user.Birthday = result.Birthday.toISOString().slice(0, 10);
        //user.Birthday = user.Birthday.toISOString().slice(0,10);
        done(err, user);
    });
});

var loggedIn = false;
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password',
}, async function (req, username, password, done) {
    var test = [];
    test.push({
        hung: 1
    })
    try {
        //tim user
        //const user  = await User.findOne({ username: username });
        //them user = await 
        const sql = 'SELECT * FROM customer where UserName = ?'
        let user = await query(sql, username);
        user = user[0]
        //
        if (user) {
            if (!user.Status) {
                req.flash('errorlogin', 'Tài khoản của bạn đã bị khóa');
                return done(null, false);
            }
            //kiem tra da xac nhan email chua
            if (!user.Active) {
                req.flash('errorlogin', 'Vui lòng xác nhận email');
                return done(null, false, { message: 'Sorry, you must validate email first' });
            }

            //so sanh password       
            //const match = await bcrypt.compareSync(password, user.password);
            const match = await bcrypt.compareSync(password, user.PassWord);
            if (match) {
                loggedIn = true;
                return done(null, {
                    id: user.ID_Customer
                });
                req.user = user;

                return;
            }
            if (loggedIn) {
                console.log("welcome");
            }
        }
        req.flash('errorlogin', 'Tên tài khoản hoặc Mật khẩu không đúng, vui lòng thử lại');
        return done(null, false);
    } catch (err) {
        next(err);
    }
}));
