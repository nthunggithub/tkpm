var User=require("../models/User")
var randomstring = require("randomstring")
var bcrypt = require('bcrypt-nodejs')
var mailer = require('../config/mailer')
require('dotenv').config();
// Xử lí đăng kí tài khoản mật khẩu

module.exports.signup= function(req, res, next) {
    res.render('account/sign-up', { layout:'layout-account.hbs', success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
};
exports.signuppost=async function(req,res, next){
    let user=new User()
    user.username=req.body.username;
    user.email=req.body.email;
    user.password=req.body.password;
    var check=true;
    var errors=null;
    var checkbox=req.body.checkbox;

    if(!checkbox){
        errors="Bạn chưa nhấn đồng ý";
        check=false;
    }
    else if(user.password!=req.body.confirm)
    {
        // console.log("error");
        errors="Mật khẩu xác nhận của bạn không đúng";
        check=false;
    }
    else if(user.password ==req.body.confirm){
        user.password = user.hashPassword(user.password);
    }

    // Email có tồn tại trong database hay ko
    try{
        let result =  await  User.findOne({email:req.body.email});
        if(result)
        {
            console.log("Email đã tồn tại")
            check=false;
            errors="Email đã tồn tại";
        }
        else
        {
            console.log("oke");
        }
    }
    catch(err){
        console.log(err);
    }
    try{
        let result=await User.findOne({username:req.body.username});
        if(result)
        {
            check=false;
            errors="Tên tài khoản đã tồn tại";
        }
        else
        {
            console.log("oke");
        }
    }
    catch (err) {
        console.log(err);
    }
    if(check===false)
    {
        success=false;
    }
    if(check===true)
    {
        try{
                // Generate secret token
            const secretToken = randomstring.generate();
            console.log('secretToken', secretToken);
            user.secretToken = secretToken;
            user.active = false;
            const html = `Xin chào ${user.username},
        <br/>
        Cảm ơn bạn đã đăng ký!
        <br/><br/>
        Vui lòng nhấp vào link để verify your email.
        <br/>
        Link: <b>${process.env.urlwebsite}verify/${secretToken}</b>
        <br/>
        <br/><br/>
        Chúc bạn thành công`
        await mailer.sendEmail(process.env.usermailer, user.email, 'Please verify your email!', html);
            success=true;
            req.flash('success', 'Please check your email.');
            user.save((err, doc) => {
                res.redirect('/');
            })
        }catch(err){
            next(err);
        }
    }
    if(check===false) {
        res.render('account/sign-up', {layout: 'layout-account.hbs', check: check, errors: errors})
    }
}
 
module.exports.login = function(req, res, next) {

    errors = req.flash('errorlogin');
  
    res.render('account/login', {errors: errors, layout: 'layout-account.hbs'});

};

module.exports.logout = function(req, res)
{
    req.logout();
    req.session.destroy();
    res.redirect('/');
}

module.exports.verify = async function(req, res, next){
    try{
    const secretToken = req.params.id;

    const user =  await User.findOne({'secretToken': secretToken});
        
    if(!user){
        res.redirect('/');
        return;
    }

    if(req.session.changeemail){
        user.email = req.session.changeemail;
        req.session.changeemail = null;
        await user.save();
        res.redirect('/profile');
        return;
    }
     user.active = true;
     user.secretToken = "";
    await user.save();

    req.flash('success', 'verify thanh cong');
    res.redirect('/login');
    }catch(error){
        next(error);
    }

}

module.exports.forgotpassword = function(req, res, next) {
    res.render('account/forgot-password', {layout: 'layout-account.hbs', check: req.flash('check')});
}

module.exports.forgotpasswordpost = async function(req, res, next){
    try{
        
    const email = req.body.email;

    const user = await User.findOne({'email': email});

    if(!user){
        req.flash("check" , "Email không tồn tại")
        res.redirect('/forgot-password')
        console.log('quen mat khau khong ton tai email')
        return;
    }

    user.secretToken = randomstring.generate();

    await user.save();

    const html = `Xin chào ${user.username},
      <br/>
      Bạn đã lấy lại mật khẩu thành công!
      <br/><br/>
      Mật khẩu của bạn là: 123456
      <br/>
      <b>Vui lòng nhấn vào link để hoàn tất quá trình đổi mật khẩu</b>
      <br/>
      Link : <b>${process.env.urlwebsite}forgot-password/${user.secretToken}</b>
      <br/>
      <p>Vui lòng đổi mật khẩu sau khi hoàn tất</p>
      <br/><br/>
      Chúc bạn thành công`
      await mailer.sendEmail(process.env.usermailer, user.email, 'Đổi mật khẩu!', html);


    
    res.redirect('/login');
    }catch(err){
        next(err);
    }


}

module.exports.forgotpasswordverify = async function(req, res, next){
   try{
    var user = await User.updateOne({secretToken: req.params.id}, {$set: {password: bcrypt.hashSync("123456", bcrypt.genSaltSync(10))}, secretToken: ""});
    console.log(user);
    res.redirect('/');
   }catch(err){
       next(err);
   }
}

module.exports.profile =function(req, res, next) {

    res.render('users/profile', {message: req.flash("messageprofile"), user: req.user});
}

module.exports.profileupdate = async function(req, res, next) {
    
    try{
        var user = await User.findById(req.user._id);
        if(req.user.email != req.body.email){
            var useremail = await User.findOne({email: req.body.email});

            if(!useremail){
                //user.email = req.body.email;
            req.flash('messageprofile', 'Vui lòng verify email để thay đổi email');
            user.secretToken = randomstring.generate();
            req.session.changeemail = req.body.email;
            const html = `Xin chào ${req.user.username},
          <br/>
          Cảm ơn bạn đã đăng ký!
          <br/><br/>
          Vui lòng nhấp vào link để verify your email.
          <br/>
          Link: <b>${process.env.urlwebsite}verify/${user.secretToken}</b>
          <br/>
          <br/><br/>
          Chúc bạn thành công`
          await mailer.sendEmail(process.env.usermailer, req.body.email, "Vui lòng Verify email", html)
            }else{
                req.flash('messageprofile', 'Email đã tồn tại');
            }
        }
        
        
        user.name = req.body.name;
        user.phonenumber = req.body.phonenumber;
        user.gender = req.body.gender;
        user.nickname = req.body.nickname;
        user.date = req.body.date;
        if(req.body.date != ""){
            user.age = new Date().getFullYear() - req.body.date.split('-')[0];
        }
        
        await user.save();
        res.redirect('/profile');
    }catch(error){
        next(error);
    }
}
  

module.exports.updatepassword = function(req, res, next){
    res.render('account/update-password',{layout: 'layout-account.hbs', errorupdatePass: req.flash("errorupdatePass")});
}

module.exports.updatepasswordpost= async function(req, res, next){
    try{
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var confirmpassword = req.body.confirm;
    
    var user = await User.findById(req.user._id)
    
    if(!user.comparePassword(oldpassword, user.password)){
        req.flash("errorupdatePass", "Mật khẩu hiện tại không đúng");
        res.redirect("/update-password");
        return;
    }
    if(newpassword != confirmpassword){
        req.flash("errorupdatePass", "Mật khẩu xác nhận không đúng");
        res.redirect("/update-password");
        return;
    }

    user.password = user.hashPassword(newpassword);

    await user.save();
    req.flash("errorupdatePass", "Mật khẩu đã thay đổi");
    res.redirect("/update-password");
    return;
    }catch(error){
        next(error);
    }

}