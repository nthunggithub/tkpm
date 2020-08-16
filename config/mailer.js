const nodemailer = require('nodemailer');
require('dotenv').config();
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.usermailer,
    pass: process.env.passmailer,
    //type: "OAuth2",
    //clientId: '528516541982-8bh2db073cn03h24k7a2fqhc66avk61i.apps.googleusercontent.com',
    //clientSecret: 'e3C_YifNjbJqB2scpbIwwNgK',
    //refreshToken: '1//04JiSs0a6uQc4CgYIARAAGAQSNwF-L9Ir78krnm8DmfqKMw5GD2ym5k-zaBeFF6PIJeO-Hbbw1rYjZ35qzPZwOuPpP_VknVZaBfI',
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {
  sendEmail(from, to, subject, html) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) {
          reject(err);
        }
        console.log('Email sent: ');
        resolve(info);
      });
    });
  }
}