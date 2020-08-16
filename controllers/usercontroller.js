var randomstring = require("randomstring")
var bcrypt = require('bcrypt-nodejs')
var mailer = require('../config/mailer')
require('dotenv').config();
var query = require('../models/db');
var customer = require('../models/customer');
// Xử lí đăng kí tài khoản mật khẩu


module.exports.signup = function (req, res, next) {
    res.render('account/sign-up', { layout: 'layout-account.hbs', success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
};
exports.signuppost = async function (req, res, next) {
    let user = {};
    user.password = req.body.password;
    user.UserName = req.body.username;
    user.Email = req.body.email;
    user.FullName = req.body.fullname;
    user.Gender = req.body.gender;
    //user.Phone = "1975-01-01";
    //user.Phone = req.body.phone;
    // user.Address = req.body.address;
    user.Birthday = new Date("1975-01-01");
    var check = true;
    var errors = null;
    var checkbox = req.body.checkbox;

    if (!checkbox) {
        errors = "Bạn chưa nhấn đồng ý";
        check = false;
    }
    else if (user.password != req.body.confirm) {
        // console.log("error");
        errors = "Mật khẩu xác nhận của bạn không đúng";
        check = false;
    }

    else if (user.password == req.body.confirm) {
        //var hash = new User();
        let hash = new customer();
        user.password = hash.hashPassword(user.password);
    }

    // Email có tồn tại trong database hay ko
    try {
        //let result =  await  User.findOne({email:req.body.email});
        let result = await query('SELECT * FROM customer where Email = ?', req.body.email);
        if (result.length > 0) {
            console.log("Email đã tồn tại")
            check = false;
            errors = "Email đã tồn tại";
        }
        else {
            console.log("oke");
        }
    }
    catch (err) {
        console.log(err);
    }
    try {
        //let result= await User.findOne({username:req.body.username});
        let result = await query('SELECT * FROM customer where UserName = ?', req.body.username);
        if (result.length > 0) {
            check = false;
            errors = "Tên tài khoản đã tồn tại";
        }
        else {
            console.log("oke");
        }
    }
    catch (err) {
        console.log(err);
    }
    if (check === false) {
        success = false;
    }
    if (check === true) {
        try {
            // Generate secret token
            const secretToken = randomstring.generate();
            console.log('secretToken', secretToken);
            user.SecretToken = secretToken;
            user.Active = false;
            user.Status = true;
            const html = `Xin chào ${user.UserName},
        <br/>
        Cảm ơn bạn đã đăng ký!
        <br/><br/>
        Vui lòng nhấp vào link để verify your email.
        <br/>
        Link: <b>${process.env.urlwebsite}verify/${secretToken}</b>
        <br/>
        <br/><br/>
        Chúc bạn thành công`
            console.log(user);
            await mailer.sendEmail(process.env.usermailer, user.Email, 'Please verify your email!', html);
            success = true;
            req.flash('success', 'Please check your email.');
            //await query('INSERT INTO customer SET ? ', user);
            await customer.addcustomer(user);
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }
    if (check === false) {
        res.render('account/sign-up', { layout: 'layout-account.hbs', check: check, errors: errors })
    }
}

module.exports.login = function (req, res, next) {

    errors = req.flash('errorlogin');

    res.render('account/login', { errors: errors, layout: 'layout-account.hbs' });

};

module.exports.logout = function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}

module.exports.verify = async function (req, res, next) {
    try {
        const secretToken = req.params.id;
        const user = await query('select * from customer where SecretToken = ? ', [secretToken]);
        
        if (user.length == 0) {
            res.redirect('/');
            return;
        }
        //phần change mail chưa chỉnh
        // if (req.session.changeemail) {
        //     user.email = req.session.changeemail;
        //     req.session.changeemail = null;
        //     await user.save();
        //     res.redirect('/profile');
        //     return;
        // }
        // user.Active = true;
        // user.secretToken = "";
        // await user.save();

        await query('update customer set Active = ?, secretToken = ? where SecretToken = ?',[true, "", secretToken]);

        req.flash('success', 'verify Thành công');
        res.redirect('/login');
    } catch (error) {
        next(error);
    }

}

module.exports.forgotpassword = function (req, res, next) {
    res.render('account/forgot-password', { layout: 'layout-account.hbs', check: req.flash('check') });
}

module.exports.forgotpasswordpost = async function (req, res, next) {
    try {
        const email = req.body.email;
        let user = await query('SELECT * FROM customer where Email = ?',[email]);
        if (user.length == 0) {
            req.flash("check", "Email không tồn tại")
            res.redirect('/forgot-password')
            console.log('quen mat khau khong ton tai email')
            return;
        }
        user.SecretToken = randomstring.generate();
        await query('update customer set SecretToken = ? where Email = ?', [user.SecretToken, email]);
        const html = `Xin chào ${user.UserName},
      <br/>
      Bạn đã lấy lại mật khẩu thành công!
      <br/><br/>
      Mật khẩu của bạn là: 123456
      <br/>
      <b>Vui lòng nhấn vào link để hoàn tất quá trình đổi mật khẩu</b>
      <br/>
      Link : <b>${process.env.urlwebsite}forgot-password/${user.SecretToken}</b>
      <br/>
      <p>Vui lòng đổi mật khẩu sau khi hoàn tất</p>
      <br/><br/>
      Chúc bạn thành công`
        await mailer.sendEmail(process.env.usermailer, email, 'Đổi mật khẩu!', html);

        res.redirect('/login');
    } catch (err) {
        next(err);
    }


}

module.exports.forgotpasswordverify = async function (req, res, next) {
    try {
        //var user = await User.updateOne({ secretToken: req.params.id }, { $set: { password: bcrypt.hashSync("123456", bcrypt.genSaltSync(10)) }, secretToken: "" });
        await query('update customer set PassWord = ?, SecretToken = ? where SecretToken = ?', [bcrypt.hashSync("123456", bcrypt.genSaltSync(10)),"", req.params.id]);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

module.exports.profile = function (req, res, next) {
    
    res.render('users/profile', { message: req.flash("messageprofile"), user: req.user });
}

module.exports.profileupdate = async function (req, res, next) {

    try {
        let user = {};
        if (req.user.Email != req.body.email) {
            var useremail = await query('SELECT * FROM customer where Email = ?',[req.body.email] );
            if (useremail.length == 0) {
                //user.email = req.body.email;
        //         req.flash('messageprofile', 'Vui lòng verify email để thay đổi email');
        //         user.SecretToken = randomstring.generate();
        //         req.session.changeemail = req.body.email;
        //         const html = `Xin chào ${req.user.UserName},
        //   <br/>
        //   Cảm ơn bạn đã đăng ký!
        //   <br/><br/>
        //   Vui lòng nhấp vào link để verify your email.
        //   <br/>
        //   Link: <b>${process.env.urlwebsite}verify/${user.SecretToken}</b>
        //   <br/>
        //   <br/><br/>
        //   Chúc bạn thành công`
        //         await mailer.sendEmail(process.env.usermailer, req.body.email, "Vui lòng Verify email", html)
            } else {
                req.flash('messageprofile', 'Email đã tồn tại');
            }
        }


        user.UserName = req.body.name;
        user.Phone = req.body.phonenumber;
        user.Gender = req.body.gender;
        user.Address = req.body.nickname;
        user.Birthday = req.body.date;
        // await query('update customer set FullName = ?, Phone = ?, Gender = ?,Address = ?, Birthday=?, Email = ?'+
        // ' where ID_Customer = ?', [req.body.name, req.body.phonenumber, req.body.gender, req.body.address, req.body.date, req.body.email, req.user.ID_Customer])
        await customer.updateCustomer(req.body.name, req.body.phonenumber, req.body.gender, req.body.address, req.body.date, req.body.email, req.user.ID_Customer);
        res.redirect('/profile');
    } catch (error) {
        next(error);
    }
}

module.exports.editprofile = function (req, res, next) {
    res.render('users/updateprofile', { message: req.flash("messageupdateprofile"), user: req.user });
}

module.exports.updatepassword = function (req, res, next) {
    res.render('account/update-password', { layout: 'layout-account.hbs', errorupdatePass: req.flash("errorupdatePass") });
}

module.exports.updatepasswordpost = async function (req, res, next) {
    try {
        let oldpassword = req.body.oldpassword;
        let newpassword = req.body.newpassword;
        let confirmpassword = req.body.confirm;

        //let user = new User();
        let user = new customer();
        let datauser = await query('select * from customer where UserName = ?', req.user.UserName);
        
        if (!user.comparePassword(oldpassword, datauser[0].PassWord)) {
            req.flash("errorupdatePass", "Mật khẩu hiện tại không đúng");
            res.redirect("/update-password");
            return;
        }
        if (newpassword != confirmpassword) {
            req.flash("errorupdatePass", "Mật khẩu xác nhận không đúng");
            res.redirect("/update-password");
            return;
        }

        user.password = user.hashPassword(newpassword);

        await query('update customer set PassWord = ? where UserName = ?', [user.password, req.user.UserName]);
        req.flash("errorupdatePass", "Mật khẩu đã thay đổi");
        res.redirect("/update-password");
        return;
    } catch (error) {
        next(error);
    }

}