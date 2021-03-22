const nodemailer = require("nodemailer");

const mail = async (receiver, content) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: `"${process.env.APPLICATION_NAME} 👻" <${process.env.APPLICATION_SUPPORT_EMAIL}>`,
        to: receiver.email,
        subject: content.subject,
        html: content.template
    });
    return info;
}

module.exports = {
    mail
};