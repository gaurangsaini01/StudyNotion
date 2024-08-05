const nodemailer = require("nodemailer");
require("dotenv").config();

async function mailSender(email, title, body) {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transport.sendMail({
      from: '"StudyNotion 👻" <gaurangsaini01@gmail.com>', // sender address
      to: email, // list of receivers
      subject: title, // Subject line
      html: body, // html body
    });
    // console.log(info);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
async function sendMailToMyself(email, firstName, body) {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transport.sendMail({
      from: email, // sender address
      to: "gaurangsaini01@gmail.com", // list of receivers
      subject: `Contact Form Submission from ${firstName}`, // Subject line
      text: body, // html body
    });
    // console.log(info);

    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = { mailSender, sendMailToMyself };
