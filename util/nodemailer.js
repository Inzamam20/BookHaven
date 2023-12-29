const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const { MAIL_USERNAME, MAIL_PASSWORD } = process.env;

// Creating a Transporter Object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
    },
});

// function generateVerificationCode() {
//     const min = 100000; // Minimum 6-digit number
//     const max = 999999; // Maximum 6-digit number
//     // Generate random number between min and max (inclusive)
//     const randomCode = crypto.randomInt(min, max + 1);
//     return randomCode.toString(); // Convert the number to string
// }

// const code = generateVerificationCode();

// const mailOptions = {
//     from: process.env.MAIL_USERNAME,
//     to: 'mir.inzamam2000@gmail.com',
//     subject: 'Verification Code for Perfume Parlor Application',
//     text: `Your verification code is: ${code}`,
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log('Error Occured: ', error);
//     } else {
//         console.log(`Email sent: ${info.response.toString()}`);
//         console.log(`Your verification code is: ${code}`);
//     }
// });

module.exports = transporter;

// console.log("Generated Secure Random Code:" + generateVerificationCode());
