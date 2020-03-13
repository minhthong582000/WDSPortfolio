// const nodemailer = require("nodemailer"); //đang bị lỗi require nodemailer(Dưa Hauz)
module.exports.resetmail = function(){console.log("mailsent")}
// module.exports.resetmail = async function (token, email) {
//     let account = await nodemailer.createTestAccount();
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         // secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.MAIL, // generated ethereal user
//             pass: process.env.MAIL_PASSWORD  // generated ethereal password
//         }
//     });
//     let mailOptions = {
//         to: email,
//         from: (process.env.HOST_MAIL || "NhanDepchaiz"),
//         subject: 'Node.js Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://' + (process.env.HOST_URL || "localhost:8000") + '/reset/' + token + '\n\n' +
//             'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//     };
//     transporter.sendMail(mailOptions, function (err, info) {
//         if (err)
//             console.log(err)
//         else
//             console.log(info);
//     });
// };