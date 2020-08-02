var passport = require('passport');
var User = require('../models/User');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs')
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

var loggedIn=false;
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username', 
    passwordField: 'password',
}, async function (req, username, password, done) {

    try{
        //tim user
    const user  = await User.findOne({ username: username });
    
    if (user && user._id) {
       if(user.block){
        req.flash('errorlogin', 'Tài khoản của bạn đã bị khóa');
        return done(null, false);
       }
        //kiem tra da xac nhan email chua
        if (!user.active) {
            req.flash('errorlogin', 'Vui lòng xác nhận email');
            return done(null, false, { message: 'Sorry, you must validate email first' });
        }

        //so sanh password       
        const match = await bcrypt.compareSync(password, user.password);
        
        if (match) {
            loggedIn=true;
            return done(null, {
                id: user._id
            });
        }
        if (loggedIn)
        {
            console.log("welcome");
        }
    }
    req.flash('errorlogin', 'Tên tài khoản hoặc Mật khẩu không đúng, vui lòng thử lại');
    return done(null, false);  
    }catch(err){
        next(err);
    }
}));
