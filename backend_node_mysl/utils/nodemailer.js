const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "cifovioleta5@gmail.com",
        pass: "iguk cusz bfrb zmjn"
    }
})

async function sendMailTo(emailFrom, emailTo, subject, text, html ) {
    const emailOptions = {
        from: emailFrom,
        to: emailTo,
        subject,
        text,
        html
    }
    return transporter.sendMail(emailOptions)
}

module.exports = {sendMailTo};